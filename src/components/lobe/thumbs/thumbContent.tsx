/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import React, { FunctionComponent, useCallback } from "react";
// import Strings from '@lobe/shared/assets/strings/lobeStrings.json';
import { TryoutLabelingState } from "../tryoutView/tryoutCommonTypes";
import checkmark from "./icons/checkmark.svg";
import checkmarkThin from "./icons/checkmarkThin.svg";
import incorrect from "./icons/incorrect.svg";
import { ThumbButton } from "./thumbButton";
import { ThumbButtonTypes } from "./thumbsTypes";
// import {TooltipId} from '../../tooltip';
// import {TelemetryClient, TelemetryEvents} from '../../../utils/telemetry';

interface ThumbsContentProps {
  // show either thumbs up or down initially
  defaultComponent: ThumbButtonTypes;
  // if the other component is pressed, we'll show the default
  downOrUpPressed: ThumbButtonTypes;
  onClick: (ThumbButtonTypes) => void;
  // will determine when 'Add' and 'Added' components are shown
  labelingState: TryoutLabelingState;
  onContentLoaded?: () => void;
}

const ThumbContent: FunctionComponent<ThumbsContentProps> = ({
  defaultComponent,
  downOrUpPressed,
  onClick,
  labelingState,
  onContentLoaded,
}) => {
  const onThumbsDown = useCallback(
    (e) => {
      e.stopPropagation();
      onClick(ThumbButtonTypes.ThumbsDown);

      // TelemetryClient.trackEvent(TelemetryEvents.SELECT_PLAY_INCORRECT);
    },
    [onClick]
  );

  const onThumbsUp = useCallback(
    (e) => {
      e.stopPropagation();
      onClick(ThumbButtonTypes.ThumbsUp);

      // TelemetryClient.trackEvent(TelemetryEvents.SELECT_PLAY_CORRECT);
    },
    [onClick]
  );

  const onAdd = useCallback(
    (e) => {
      e.stopPropagation();
      onClick(ThumbButtonTypes.Add);
    },
    [onClick]
  );

  const onAdded = useCallback(
    (e) => {
      e.stopPropagation();
      onClick(ThumbButtonTypes.Added);
    },
    [onClick]
  );

  // if a thumbs up or down hasn't been pressed or
  // the other button button has been pressed
  // show the default component since we're going to hide it
  if (!downOrUpPressed || downOrUpPressed !== defaultComponent) {
    if (defaultComponent === ThumbButtonTypes.ThumbsDown) {
      return (
        <ThumbButton
          onContentLoaded={onContentLoaded}
          iconOptions={{ icon: incorrect }}
          onClick={onThumbsDown}
          // tooltipId={TooltipId.TRYOUT_INCORRECT}
        />
      );
    } else {
      return (
        <ThumbButton
          onContentLoaded={onContentLoaded}
          iconOptions={{ icon: checkmark }}
          onClick={onThumbsUp}
          // tooltipId={TooltipId.TRYOUT_ADD}
        />
      );
    }
  }

  if (labelingState === TryoutLabelingState.Labeling) {
    return (
      <ThumbButton
        onContentLoaded={onContentLoaded}
        onClick={onAdd}
        // tooltipId={TooltipId.TRYOUT_ADD}
        // textOptions={{
        //   animate: true,
        //   text: Strings.Tryout.ThumbsButtonAdd,
        // }}
      />
    );
  } else if (labelingState === TryoutLabelingState.Labeled) {
    return (
      <ThumbButton
        onContentLoaded={onContentLoaded}
        highlightable={false}
        iconOptions={{
          animate: true,
          icon: checkmarkThin,
        }}
        onClick={onAdded}
        textOptions={{
          animate: true,
          text: "ADDED",
        }}
      />
    );
  } else {
    // labeling state back to none and downOrUpPressed hasn't been reset yet
    return null;
  }
};

export { ThumbContent };
