/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import _ from "lodash";
import React, { FC, ReactText, useCallback, useEffect, useMemo } from "react";
import { TypeaheadMenu } from ".";
// import styles from '../../../styles/labelPillPrediction.scss';
import "../../../styles/playTypeahead.scss";
import { LabelPill } from "../labelPill";
import { LabelPillScale } from "../labelPill/types";
import playSpinner from "../shared/playSpinner.gif";
import { TryoutLabelingState } from "../tryoutView/tryoutCommonTypes";
// import {useLobeSelector} from '../../../lobeRedux';
import { ProjectLabelValueType } from "../types/dataset";
import {
  DataItemLabelPredictionType,
  PredictedLabelInfo
} from "../utils/flex/flexUtils";
import { useProjectLabels } from "../utils/hooks";
import { Typeahead } from "./typeahead";
import { TypeaheadInput } from "./typeaheadInput";

// const {
//   labelPillPredictionCorrectBackgroundColor: backgroundColor,
//   labelPillPredictionCorrectForegroundColor: foregroundColor,
// } = styles;

const backgroundColor = "#116652";
const foregroundColor = "#00ddb3";

interface PlayTypeaheadProps {
  labelingState?: TryoutLabelingState;
  onClick?: (e: React.MouseEvent) => void;
  onSubmit?: (label: string) => void;
  options: ProjectLabelValueType[];
  predictionInfo: PredictedLabelInfo;
  selectedLabel?: ProjectLabelValueType;
  setSelectedLabel: (label: ProjectLabelValueType) => void;
  onCancel?: () => void;
  containerClassName?: string;
  labels: string[];
  projectId: string;
}

const PlayTypeahead: FC<PlayTypeaheadProps> = ({
  labelingState,
  onClick,
  onSubmit,
  options,
  predictionInfo,
  selectedLabel,
  setSelectedLabel,
  onCancel,
  containerClassName,
}) => {
  const { label: predictedLabel, predictionType, accuracy } = predictionInfo;
  const isLoading = predictionType === DataItemLabelPredictionType.Loading;
  const predictionWidth = _.clamp(accuracy * 100, 0, 100);
  const text = selectedLabel || predictedLabel;

  const updateSelectedLabel = useCallback(
    (label: ReactText) => {
      setSelectedLabel(label);
    },
    [setSelectedLabel]
  );

  useEffect(() => {
    if (labelingState === TryoutLabelingState.Labeling) {
      updateSelectedLabel(text);
    }
  }, [labelingState, text, updateSelectedLabel]);

  if (labelingState === TryoutLabelingState.None) {
    return (
      <LabelPill
        backgroundColor={backgroundColor}
        backdropFilter={true}
        foreground={{
          backgroundColor: foregroundColor,
          width: `${predictionWidth}%`,
        }}
        key={labelingState}
        onClick={onClick}
        readOnly={true}
        scale={LabelPillScale.LARGE}
        value={text}
        containerClassName={containerClassName}
      >
        {isLoading && (
          <img src={playSpinner} className="play-typeahead-loading-spinner" />
        )}
      </LabelPill>
    );
  } else if (labelingState === TryoutLabelingState.Labeling) {
    return (
      <Typeahead
        className={containerClassName}
        onChange={updateSelectedLabel}
        onNavigate={updateSelectedLabel}
        onSet={onSubmit}
        options={options}
        reverseMenu={true}
        scale={LabelPillScale.LARGE}
        showMenuOnMount={true}
        label={text}
        onCancel={onCancel}
      >
        <TypeaheadInput
          ignoredBlurSourceSelectors={[".thumb-content"]}
          highlight={true}
        />
        <TypeaheadMenu />
      </Typeahead>
    );
  } else if (labelingState === TryoutLabelingState.Labeled) {
    return (
      <LabelPill
        backgroundColor={foregroundColor}
        key={`${labelingState}-${text}`}
        readOnly={true}
        scale={LabelPillScale.LARGE}
        value={text}
        containerClassName={containerClassName}
      />
    );
  } else {
    return null;
  }
};

export const WrappedPlayTypeahead: FC<Omit<PlayTypeaheadProps, "options">> = (
  props
) => {
  // TODO
  const {projectId} = props;

  const labels = useProjectLabels(projectId);

  const options = useMemo((): string[] => 
  {
    console.log(`WrappedPlayTypeahead options memo: ${labels}`);
    return labels?.map((l) => l).sort();
  }, [
    labels,
  ]);

  return <PlayTypeahead options={options} {...props} />;
};
