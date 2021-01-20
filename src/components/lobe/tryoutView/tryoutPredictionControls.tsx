/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import classNames from "classnames";
import { isEqual, noop } from "lodash";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import {TryoutFilesContext} from '../contexts/tryoutFilesContext';
// import {playSound, SoundType} from '../../../sounds/playSound';
// import Strings from '@lobe/shared/assets/strings/lobeStrings.json';
import "../../../styles/tryoutPredictionControls.scss";
import { Thumbs } from "../thumbs/thumbs";
import { ThumbButtonTypes, ThumbsClickCallback } from "../thumbs/thumbsTypes";
// import {useLobeSelector} from '../lobeRedux';
import { PlayTypeahead } from "../typeahead";
import {
  DataItemLabelPredictionType,
  PredictedLabelInfo,
} from "../utils/flex/flexUtils";
import { useProjectLabels, usePropChanged } from "../utils/hooks";
import { TryoutLabelingState, TryoutTabs } from "./tryoutCommonTypes";
import { APIResponse } from "./types";
// import {TelemetryClient, TelemetryEvents} from '../../../utils/telemetry';

const AFTER_ADD_TIMEOUT = 1000;

const predictionTypeForLabelingState = {
  [TryoutLabelingState.None]: DataItemLabelPredictionType.None,
  [TryoutLabelingState.Labeling]: DataItemLabelPredictionType.None,
  [TryoutLabelingState.Labeled]: DataItemLabelPredictionType.Correct,
};

interface InferenceApiHookResult {
  predictions: Prediction[] | undefined;
  isLoading: boolean;
}

interface Prediction {
  label: string | number;
  accuracy: number;
}

export interface TryoutPredictionProps {
  imageData: string;
  showFetchingState?: boolean; // Will show loading indicator for every fetch
  labelingState: TryoutLabelingState;
  setLabelingState: (labelingState: TryoutLabelingState) => void;
  pauseAfterAdd?: boolean;
  tab: string;
  projectId: string;
  labels: string[];

  onSubmit: (label: string | number) => void;
  onTryoutLabelingStateChange?: (state: TryoutLabelingState) => void;
  onThumbsMouseEnter?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onThumbsMouseLeave?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

function getPrediction(
  projectId: string,
  base64Image: any,
  success: (data: any) => void
) {
  chrome.runtime.sendMessage(
    {
      message: "get_prediction",
      projectId: projectId,
      base64Image: base64Image,
    },
    function (response) {
      success(response && response.data);
    }
  );
}

// FetchPredictionForImage(
//   projectId,
//   imageSrc,
//   (prediction: string, accuracy: number) => {
//     // console.log(`fetch callback: ${prediction} - ${accuracy}%`);
//     setPrediction(prediction);
//     setAccuracy(accuracy);
//   }
// );

function FetchPredictionForImage({
  projectId,
  imageSrc,
  callback,
}: {
  projectId: string;
  imageSrc: string;
  callback: (data: any) => void;
}) {
  local_url_to_data_url(imageSrc, function (data) {
    getPrediction(projectId, data, function (data) {
      // const { outputs } = JSON.parse(data);
      // let percentage = 0;
      // for (var idx in outputs.Labels) {
      //   if (outputs.Labels[idx][0] === outputs.Prediction[0]) {
      //     percentage = outputs.Labels[idx][1] * 100;
      //   }
      // }
      // callback(outputs.Prediction, percentage);
      callback(JSON.parse(data));
    });
  });
}

function local_url_to_data_url(url: any, success: (data: string) => void) {
  chrome.runtime.sendMessage(
    { message: "convert_image_url_to_data_url", url: url },
    function (response) {
      success(response && response.data);
    }
  );
}

function useGetPrediction<T>(projectId?: string, base64Image?: string) {
  interface PredictionState {
    loading: boolean;
    error: any;
    response: T;
    abort: () => void;
  }

  const [state, setState] = useState<PredictionState>({
    loading: false,
    response: null,
    error: null,
    abort: noop,
  });

  const projectIdRef = useRef<string>(null);
  const base64ImageRef = useRef<string>(null);

  // In order to prevent memory leaks we need to prevent setting state after a component unmounts
  const ignoreRef = useRef(false);
  useEffect(() => {
    return () => {
      ignoreRef.current = true;
    };
  }, [ignoreRef]);

  useEffect(() => {
    // Check for change in project or image
    if (
      projectId &&
      (projectIdRef.current !== projectId ||
        !isEqual(base64ImageRef.current, base64Image))
    ) {
      projectIdRef.current = projectId;
      base64ImageRef.current = base64Image;
      if (state.loading) {
        state.abort();
      } else {
        const FetchData = () => {
          try {
            const controller = new AbortController();
            state.loading = true;
            state.response = null;
            state.error = null;
            state.abort = () => controller.abort();
            setState(state);

            // const res = await fetch(projectIdRef.current, {
            //   signal: controller.signal,
            //   ...base64ImageRef.current,
            // });
            // const response = (await res.json()) as T;
            FetchPredictionForImage({
              projectId,
              imageSrc: base64Image,
              callback: (response: any) => {
                // console.log(`fetch callback: ${prediction} - ${accuracy}%`);
                // setPrediction(prediction);
                // setAccuracy(accuracy);
                console.log("callback");
                if (!ignoreRef.current) {
                  console.log(`setting state ${response}`);
                  console.log(response);
                  setState({
                    loading: false,
                    response,
                    error: null,
                    abort: noop,
                  });
                }
              },
            });
            // getPrediction(projectId, base64Image, async (data) => {
            //   alert(base64Image);
            //   const response = JSON.parse(data);
            //   // const { outputs } = JSON.parse(data);
            //   // let percentage = 0;
            //   // for (var idx in outputs.Labels) {
            //   //   if (outputs.Labels[idx][0] === outputs.Prediction[0]) {
            //   //     percentage = outputs.Labels[idx][1] * 100;
            //   //   }
            //   // }
            //   // callback(outputs.Prediction, percentage);
            // });
          } catch (error) {
            if (!ignoreRef.current) {
              setState({
                loading: false,
                response: null,
                error,
                abort: noop,
              });
            }
          }
        };

        FetchData();
      }
    }
  }, [projectId, base64Image, projectIdRef, base64ImageRef, state, ignoreRef]);

  return state;
}

function useInferenceApi(
  projectId?: string,
  imageData?: string
): InferenceApiHookResult {
  const [predictions, setPredictions] = useState<Prediction[]>();
  const fetch = useGetPrediction<APIResponse>(projectId, imageData);
  const stateChanged = usePropChanged(fetch);

  useEffect(() => {
    let predictions: Prediction[];
    if (stateChanged && fetch.response) {
      console.log(
        `fetch.response: ${JSON.stringify(
          fetch.response
        )} - ${typeof fetch.response}`
      );
      const { Labels: labels } = fetch.response.outputs;
      try {
        predictions = labels
          .map((resultTuple) => {
            const prediction: Prediction = {
              label: resultTuple[0],
              accuracy: resultTuple[1],
            };
            return prediction;
          })
          .sort((a, b) => {
            return b.accuracy - a.accuracy;
          });
      } catch (err) {
        console.warn(
          `useInferenceApi(): API returned unexpected predictions format`,
          fetch.response
        );
      }
      setPredictions(predictions);
    } else if (fetch.error) {
      console.error(
        new Error(`useInferenceApi(): Error getting predictions ${fetch.error}`)
      );
      setPredictions(predictions);
    }
  }, [stateChanged, fetch]);

  return { predictions, isLoading: fetch.loading };
}

const TryoutPredictionControls: FunctionComponent<TryoutPredictionProps> = ({
  imageData,
  showFetchingState,
  pauseAfterAdd,
  tab,
  onSubmit,
  onThumbsMouseEnter,
  onThumbsMouseLeave,
  onTryoutLabelingStateChange,
  labelingState,
  setLabelingState,
  projectId,
  labels,
}) => {
  const [selectedLabel, setSelectedLabel] = useState<string | number>(
    undefined
  );

  const { predictions, isLoading } = useInferenceApi(projectId, imageData);
  const hasPrediction = !!(predictions && predictions.length);

  // const {clearFiles} = useContext(TryoutFilesContext);

  // TODO -- Populate stat.labels.labels using inference
  // const labels = useProjectLabels(projectId);//[{ label: "TODO" }]; //useLobeSelector(state => state.labels.labels);

  let isReady = false;
  if (showFetchingState) {
    isReady = hasPrediction && !isLoading;
  } else {
    isReady = hasPrediction;
  }

  const predictionInfo: PredictedLabelInfo = useMemo(() => {
    let label: string | number;
    let accuracy: number;
    let predictionType: DataItemLabelPredictionType;

    if (isReady) {
      if (labelingState === TryoutLabelingState.Labeled) {
        label = selectedLabel;
        accuracy = 1;
        predictionType = predictionTypeForLabelingState[labelingState];
      } else {
        label = hasPrediction ? predictions[0].label.toString() : label;
        accuracy = hasPrediction ? predictions[0].accuracy : 0;
        predictionType = hasPrediction
          ? DataItemLabelPredictionType.Correct //predictionTypeForLabelingState[labelingState]
          : predictionType;
      }
    } else {
      label = "Loading..."; //Strings.Evaluate.PredictionLoadingLabel;
      accuracy = 0;
      predictionType = DataItemLabelPredictionType.Loading;
    }
    console.log(`stuff: ${label} ${accuracy} ${predictionType}`);

    return {
      label,
      accuracy,
      predictionType,
    };
  }, [isReady, hasPrediction, labelingState, predictions, selectedLabel]);

  // const needsToFetchPrediction = usePropChanged(imageData);
  // const predictionAvailabilityChanged = usePropChanged(status);
  // useEffect(() => {
  //   if (
  //     (needsToFetchPrediction || predictionAvailabilityChanged) &&
  //     imageData &&
  //     !isLoading
  //   ) {
  //     getPrediction(imageData);
  //   }
  // }, [
  //   getPrediction,
  //   imageData,
  //   status,
  //   needsToFetchPrediction,
  //   predictionAvailabilityChanged,
  //   setLabelingState,
  // ]);

  const labelingStateChanged = usePropChanged(labelingState);
  useEffect(() => {
    if (labelingStateChanged && onTryoutLabelingStateChange) {
      onTryoutLabelingStateChange(labelingState);
    }
  }, [labelingStateChanged, labelingState, onTryoutLabelingStateChange]);

  const resetLabeling = useCallback(
    (e?: React.FocusEvent<HTMLDivElement>) => {
      if (e && e.target.closest(".tryout-prediction-controls-container")) {
        return;
      }

      // TODO -- reset works, but the pill remains dark green -- figure out how to retrigger the fill I think?
      // setSelectedLabel(undefined);
      setLabelingState(TryoutLabelingState.None);
    },
    [setLabelingState]
  );

  const setLabeled = useCallback(
    (label?: string | number) => {
      // playSound(SoundType.TRYOUT_ADDED);
      setSelectedLabel(label || predictionInfo.label.toString());
      setLabelingState(TryoutLabelingState.Labeled);

      if (pauseAfterAdd) {
        setTimeout(() => {
          if (tab === TryoutTabs.Images) {
          } //clearFiles();
          // resetLabeling();
          // TODO -- Mark as added and leave?
        }, AFTER_ADD_TIMEOUT);
      }
    },
    [
      // clearFiles,
      predictionInfo,
      pauseAfterAdd,
      // resetLabeling,
      setLabelingState,
      tab,
    ]
  );

  const setLabelling = useCallback(() => {
    // playSound(SoundType.TRYOUT_THUMBS_DOWN);
    setLabelingState(TryoutLabelingState.Labeling);
  }, [setLabelingState]);

  const setAndCompleteLabeling = useCallback(
    (label: string | number) => {
      // TelemetryClient.trackEvent(TelemetryEvents.TYPEAHEAD_CHANGE_FROM_PLAY);
      console.log(`calling setLabeled(${label})`);
      setLabeled(label);
      console.log(`calling onSubmit(${label})`);
      onSubmit && onSubmit(label);
    },
    [onSubmit, setLabeled]
  );

  const onThumbsClick = useCallback<ThumbsClickCallback>(
    (type: ThumbButtonTypes) => {
      console.info(`TryoutPredictionControls: Clicked thumb type: ${type}`);
      switch (type) {
        case ThumbButtonTypes.ThumbsUp:
          console.log(
            `calling setAndCompleteLabeling(${selectedLabel} || ${predictionInfo.label})`
          );
          setAndCompleteLabeling(predictionInfo.label);
          break;
        case ThumbButtonTypes.ThumbsDown:
          // if (labels.length === 2) {
          //   const otherLabel = labels.find(
          //     (label) => label.label !== predictionInfo.label
          //   );
          //   setAndCompleteLabeling(otherLabel.label);
          // } else {
          setLabelling();
          //}
          break;
        case ThumbButtonTypes.Add:
          console.log(
            `calling setAndCompleteLabeling(${selectedLabel} || ${predictionInfo.label})`
          );
          setAndCompleteLabeling(selectedLabel || predictionInfo.label);
          break;
        default:
          console.warn(
            `TryoutPredicitonControls: Received unhandled thumb button type: ${type}`
          );
      }
    },
    [
      labels,
      setLabelling,
      predictionInfo.label,
      setAndCompleteLabeling,
      selectedLabel,
    ]
  );

  const onClick = (e) => {
    e.stopPropagation();
    setLabelingState(TryoutLabelingState.Labeling);
  };

  return (
    <div
      className={classNames("tryout-prediction-controls-container", {
        "tryout-prediction-controls-container-images":
          tab === TryoutTabs.Images,
        "tryout-prediction-controls-container-webcam":
          tab === TryoutTabs.Webcam,
        "tryout-prediction-controls--disabled": !isReady,
      })}
      onBlur={resetLabeling}
    >
      <PlayTypeahead
        projectId={projectId}
        labels={labels}
        onSubmit={setAndCompleteLabeling}
        onClick={onClick}
        predictionInfo={predictionInfo}
        labelingState={labelingState}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        onCancel={resetLabeling}
        containerClassName="play-typeahead"
      />
      <Thumbs
        disabled={!isReady}
        labelingState={labelingState}
        onMouseEnter={onThumbsMouseEnter}
        onMouseLeave={onThumbsMouseLeave}
        onClick={onThumbsClick}
      />
    </div>
  );
};

export { TryoutPredictionControls };
