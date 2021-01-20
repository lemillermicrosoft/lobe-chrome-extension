/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import classnames from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from "react";
import { TryoutLabelingState } from "../tryoutView/tryoutCommonTypes";
import { MorphWithContent, ThumbButtonColor } from "./morphWithContent";
import { ThumbContent } from "./thumbContent";
import { ThumbButtonTypes, ThumbsButtonCommonProps } from "./thumbsTypes";


interface ThumbsProps extends ThumbsButtonCommonProps {
  disabled?: boolean;
  labelingState: TryoutLabelingState;

  onClick: (ThumbButtonTypes) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Thumbs: FunctionComponent<ThumbsProps> = ({
  disabled = false,
  labelingState,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  // used to hide one of the starting wrapping containers
  // and use the other one for morphing successive elements
  const [downOrUp, setDownOrUp] = useState<ThumbButtonTypes>(null);

  const click = useCallback(
    (buttonClicked: ThumbButtonTypes) => {
      if (buttonClicked === ThumbButtonTypes.ThumbsDown) {
        setDownOrUp(ThumbButtonTypes.ThumbsDown);
      } else if (buttonClicked === ThumbButtonTypes.ThumbsUp) {
        setDownOrUp(ThumbButtonTypes.ThumbsUp);
      }
      onClick(buttonClicked);
    },
    [onClick]
  );

  // reset thumbs containers or select thumbs down because label was clicked
  useEffect(() => {
    if (labelingState === TryoutLabelingState.None) {
      setDownOrUp(null);
    } else if (labelingState === TryoutLabelingState.Labeling && !downOrUp) {
      setDownOrUp(ThumbButtonTypes.ThumbsDown);
    }
  }, [downOrUp, labelingState]);

  return (
    <div
      className={classnames("thumbs-container", {
        "thumbs-container-disabled": disabled,
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MorphWithContent
        color={
          labelingState === TryoutLabelingState.None
            ? ThumbButtonColor.Red
            : ThumbButtonColor.Green
        }
        hide={downOrUp && downOrUp === ThumbButtonTypes.ThumbsUp}
      >
        <ThumbContent
          defaultComponent={ThumbButtonTypes.ThumbsDown}
          downOrUpPressed={downOrUp}
          onClick={click}
          labelingState={labelingState}
        />
      </MorphWithContent>

      <MorphWithContent
        color={ThumbButtonColor.Green}
        hide={downOrUp && downOrUp === ThumbButtonTypes.ThumbsDown}
      >
        <ThumbContent
          defaultComponent={ThumbButtonTypes.ThumbsUp}
          downOrUpPressed={downOrUp}
          onClick={click}
          labelingState={labelingState}
        />
      </MorphWithContent>
    </div>
  );
};

export { Thumbs };
