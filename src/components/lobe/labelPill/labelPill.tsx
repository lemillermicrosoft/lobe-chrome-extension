/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

// import {isOnlyEmoji} from './utils';
import classnames from "classnames";
import React, {
  CSSProperties,
  FC,
  MutableRefObject,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import AutosizeInput, { AutosizeInputProps } from "react-input-autosize";
import { animated, useSpring } from "react-spring";
import VisibilitySensor from "react-visibility-sensor";
// import LobeStrings from '@lobe/shared/assets/strings/lobeStrings.json';
import "../../../styles/labelPill.scss";
import { TypeaheadContext } from "../typeahead/typeahead";
import { LabelPillScale } from "./types";
// import {useTypeaheadScaleMultiplier} from '../typeahead/utils';

const { DataItems } = { DataItems: { LabelPlaceholder: "Label" } };

type TransformOrigin = "left center" | "left bottom";

interface ForegroundOptions {
  animation?: React.CSSProperties;
  backgroundColor: string;
  width: string;
}

interface LabelPillProps extends Omit<AutosizeInputProps, "ref" | "inputRef"> {
  containerRef?: RefObject<HTMLDivElement>;
  inputRef?: MutableRefObject<HTMLInputElement>;
  scaleMultiplier?: number;
  highlight?: boolean;
  backdropFilter?: boolean;
  transformOrigin?: TransformOrigin;
  maxWidth?: number;
  containerClassName?: string;

  containerAnimation?: React.CSSProperties;
  backgroundColor?: string;
  foreground?: ForegroundOptions;

  // the label pill is used as an option in the typeahead
  // this removes some styles to fit within the typeahead menu
  asOption?: boolean;
  asPrediction?: boolean;
}

const LabelPill: FC<LabelPillProps> = ({
  containerAnimation,
  asOption,
  backgroundColor,
  children,
  containerRef,
  inputRef,
  onMouseLeave,
  onMouseOver,
  scaleMultiplier = 1,
  highlight,
  foreground,
  onClick,
  backdropFilter,
  transformOrigin,
  maxWidth,
  readOnly,
  asPrediction,
  containerClassName,
  // Setting value to blank since we need to keep input as a controlled input
  value: valueProp = "",
  ...props
}) => {
  const scaleStyle: CSSProperties = {
    transform: `scale(${scaleMultiplier}`,
  };
  const value = valueProp.toString();
  // autosize input doesn't size correctly with emojis and single characters
  // so to compensate, we add classes to adjust padding accordingly
  // const labelIsOnlyEmoji = isOnlyEmoji(value);
  const labelIsSingleCharacter = /*!labelIsOnlyEmoji &&*/ value.length === 1;
  const dataCy = asOption ? "label-pill-option" : "label-pill-input";

  const setInputRef = useCallback(
    (inputElement: HTMLInputElement) => {
      if (inputRef) {
        inputRef.current = inputElement;
      }
    },
    [inputRef]
  );

  const adjustmentForIconWidth = children ? 20 : 0;
  const typeaheadMaxWidth = maxWidth
    ? maxWidth - adjustmentForIconWidth
    : "100%";
  const labelOrInput = readOnly ? "label" : "input";

  const { width, backgroundColor: foregroundBackgroundColor } = foreground || {
    width: "0",
    backgroundColor: "#116652",
  };
  const [visibileAccuracy, setVisibleAccuracy] = useState<number>(0);
  const [visibility, setVisibility] = useState<boolean>(false);

  useEffect(() => {
    if (visibility) {
      setVisibleAccuracy(parseInt(width));
    } else {
      // TODO
      // If you want the animation to re-play when scrolled back into view, uncomment.
      // setVisibleAccuracy(0);
    }
  }, [visibility, setVisibleAccuracy, width]);

  const foregroundAnimation = useSpring({
    backgroundColor: foregroundBackgroundColor,
    opacity: 1,
    config: {
      tension: 125,
      friction: 22,
    },
    delay: 10,
    width: `${Math.max(0, 2 * visibileAccuracy - 100)}%`,
  });

  const onVisibilityChanged = useCallback(
    (isVisible: boolean) => {
      setVisibility(isVisible);
    },
    [setVisibility]
  );

  return (
    <VisibilitySensor onChange={onVisibilityChanged} partialVisibility={true}>
      <animated.div
        className={classnames(
          "label-pill-container",
          "label-pill-container-v2",
          `label-pill-container--${labelOrInput}`,
          containerClassName,
          {
            "label-pill--as-option": asOption,
            [`label-pill__${labelOrInput}--single-character`]: labelIsSingleCharacter,
            // [`label-pill__${labelOrInput}--only-emoji`]: labelIsOnlyEmoji,
            "label-pill--highlight": highlight,
            "label-pill--backdrop--filter": backdropFilter,
            "label-pill--as-prediction": asPrediction,
            "label-pill--empty": value === "",
          }
        )}
        ref={containerRef}
        style={{
          ...scaleStyle,
          transformOrigin,
          backgroundColor,
          ...containerAnimation,
        }}
        onMouseLeave={onMouseLeave}
        onMouseOver={onMouseOver}
        onClick={onClick}
      >
        {foreground && (
          <animated.div
            className="label-pill-foreground"
            style={{
              ...foregroundAnimation,
            }}
          />
        )}

        {readOnly ? (
          <label
            data-cy={dataCy}
            className={classnames("typeahead-input", {
              "typeahead-input--placeholder": !value,
            })}
            style={{
              maxWidth: typeaheadMaxWidth,
            }}
          >
            {value || DataItems.LabelPlaceholder}
          </label>
        ) : (
          <AutosizeInput
            {...props}
            value={value}
            inputRef={setInputRef}
            placeholder={DataItems.LabelPlaceholder}
            data-cy={dataCy}
            inputClassName="typeahead-input"
            style={{
              maxWidth: typeaheadMaxWidth,
            }}
          />
        )}

        <span className="label-pill__icon-container">{children}</span>
      </animated.div>
    </VisibilitySensor>
  );
};

export interface WrappedLabelPillProps extends LabelPillProps {
  scale?: LabelPillScale;
}

const WrappedLabelPill: FC<WrappedLabelPillProps> = ({
  scale = LabelPillScale.MEDIUM,
  ...props
}) => {
  const { scaleMultiplier: typeaheadIsHandlingScaling } = useContext(
    TypeaheadContext
  ) || { scaleMultiplier: undefined };

  // const nonTypeaheadLabelPillScaleMultiplier = useTypeaheadScaleMultiplier(
  //   scale,
  // );

  const scaleMultiplier = typeaheadIsHandlingScaling ? 1 : 1; //nonTypeaheadLabelPillScaleMultiplier;

  return <LabelPill {...props} scaleMultiplier={scaleMultiplier} />;
};

export { LabelPill };
export { WrappedLabelPill };

