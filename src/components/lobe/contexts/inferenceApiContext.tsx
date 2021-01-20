/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */
import { isEqual, noop } from 'lodash';
import React, {useState, useEffect, useCallback, useRef} from 'react';
// import {useQuery} from 'react-apollo';
import {connect} from 'react-redux';

// import {ApiMetaQuery, ApiMetaQueryType} from '../../../gql/document';
import {useFetch, usePropChanged, usePreviousProp} from '../utils/hooks';
// import {APIRequestBody, APIResponse} from '../../../utils/shipFormatter';
// import {MapLobeStateToProps} from '../../../lobeRedux';

interface APIRequestBody {
  inputs: {
    Image?: string;
  };
  key?: string;
}

interface APIResponse {
  outputs: {
    Labels: (string | number)[];
    Prediction: (string | number)[];
  };
}
interface ApiParameter {
  name: string;
  type: string;
}

interface ApiOutputs {
  labels: ApiParameter[];
  prediction: string;
}

enum InferenceApiStatus {
  Initializing = 'Initializing',
  Ready = 'Ready',
  Fetching = 'Fetching',
  Failed = 'Failed',
}

interface InferenceApiState {
  apiKey?: string;
  apiUrl?: string;
  status: InferenceApiStatus;
}

interface InferenceApiContextState {
  status: InferenceApiStatus;
  predictions?: Prediction[];
}

interface InferenceApiContextDispatch {
  getPrediction: (imageData: string) => void;
}

export interface Prediction {
  label: string | number;
  accuracy: number;
}

interface InferenceApiHookResult {
  predictions: Prediction[] | undefined;
  isLoading: boolean;
}

const InferenceApiContext = React.createContext<
  InferenceApiContextState & InferenceApiContextDispatch
>(null);

interface InferenceApiContextProviderProps
  extends InferenceApiContextConnectProps {
  projectId: string;
}

interface InferenceApiContextConnectProps {
  loadJobCompleted?: boolean;
}

const InferenceApiContextProvider: React.FunctionComponent<InferenceApiContextProviderProps> = ({
  projectId,
  children,
}) => {
  const [apiState, setApiState] = useState<InferenceApiState>({
    status: InferenceApiStatus.Initializing,
  });
  const {status} = apiState;
  const [imageData, setImageData] = useState<string>(undefined);
  const {predictions, isLoading} = useInferenceApi(projectId, imageData);

  // const [apiMetaData] = useState<ApiMeta>({projectId});
  // const [apiMetaError] = useState<any>(undefined);

  // Query for getting API info like the API key and endpoint
  // const {
  //   data: apiMetaData,
  //   error: apiMetaError,
  //   refetch: apiRefetch,
  // } = useQuery<ApiMetaQueryType>(ApiMetaQuery, {
  //   variables: {
  //     id: projectId,
  //   },
  // });

  // useEffect(() => {
  //   if (loadJobCompleted) {
  //     apiRefetch();
  //   }
  // }, [apiRefetch, loadJobCompleted]);

  const prevApiStatus = usePreviousProp(status);
  useEffect(() => {
    // Only log when intialized, has initialized or failed. Fetching is too noisy
    const consoleCall =
      status === InferenceApiStatus.Initializing ||
      status === InferenceApiStatus.Failed ||
      prevApiStatus === InferenceApiStatus.Initializing
        ? console.info
        : console.debug;

    consoleCall(`InferenceApiContext: Changed API state`, status);
  }, [status, prevApiStatus]);

  useEffect(() => {
      setApiState({
        status: InferenceApiStatus.Ready,
      });
  }, []);

  const setStatus = useCallback(
    (status: InferenceApiStatus) => {
      setApiState({...apiState, status});
    },
    [apiState],
  );

  const getPrediction = useCallback(
    (inputImageData: string) => {
      if (
        !isLoading &&
        apiState.status === InferenceApiStatus.Ready &&
        inputImageData !== imageData
      ) {
        setStatus(InferenceApiStatus.Fetching);
        setImageData(inputImageData);
      } else if (apiState.status !== InferenceApiStatus.Ready) {
        console.warn(
          `InferenceApiContext: Tried to get prediction while API wasn't ready status:${apiState.status}`,
        );
      } else {
        console.debug(
          `InferenceApiContext: Tried to get prediction for same image. Skipping.`,
        );
      }
    },
    [apiState, setStatus, imageData, isLoading],
  );

  useEffect(() => {
    if (!isLoading && apiState.status === InferenceApiStatus.Fetching) {
      console.info(`InferenceApiContext: API response`, predictions);
      setStatus(InferenceApiStatus.Ready);
    }
  }, [apiState, predictions, isLoading, setStatus]);

  const contextStateValues: InferenceApiContextState = {
    status,
    predictions,
  };

  return (
    <InferenceApiContext.Provider
      value={{...contextStateValues, getPrediction}}
    >
      {children}
    </InferenceApiContext.Provider>
  );
};

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
      (projectIdRef.current !== projectId || !isEqual(base64ImageRef.current, base64Image))
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
            getPrediction(projectId, base64Image, async (data) => {
              const response = (await data.json()) as T;
              // alert(response);
              // const { outputs } = JSON.parse(data);
              // let percentage = 0;
              // for (var idx in outputs.Labels) {
              //   if (outputs.Labels[idx][0] === outputs.Prediction[0]) {
              //     percentage = outputs.Labels[idx][1] * 100;
              //   }
              // }
              // callback(outputs.Prediction, percentage);
              if (!ignoreRef.current) {
                setState({
                  loading: false,
                  response,
                  error: null,
                  abort: noop,
                });
              }
            });
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
  imageData?: string,
): InferenceApiHookResult {
  const [predictions, setPredictions] = useState<Prediction[]>();
  const fetch = useGetPrediction<APIResponse>(projectId, imageData);
  const stateChanged = usePropChanged(fetch);

  useEffect(() => {
    let predictions: Prediction[];
    if (stateChanged && fetch.response) {
      const {Labels: labels} = fetch.response.outputs;
      try {
        predictions = labels
          .map(resultTuple => {
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
          fetch.response,
        );
      }
      setPredictions(predictions);
    } else if (fetch.error) {
      console.error(
        new Error(
          `useInferenceApi(): Error getting predictions ${fetch.error}`,
        ),
      );
      setPredictions(predictions);
    }
  }, [stateChanged, fetch]);

  return {predictions, isLoading: fetch.loading};
}

// const mapStateToProps: MapLobeStateToProps<InferenceApiContextConnectProps> = state => {
//   const {loadJobCompleted} = state.flags;

//   return {
//     loadJobCompleted,
//   };
// };

// const InferenceApiContextProviderWithRedux = connect(
//   mapStateToProps,
//   null,
// )(InferenceApiContextProvider);

export {
  // InferenceApiContextProviderWithRedux as InferenceApiContextProvider,
  InferenceApiContext,
  InferenceApiStatus,
};
