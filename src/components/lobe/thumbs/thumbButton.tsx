/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import React, {FunctionComponent} from 'react';
import {ThumbButtonLabel, ThumbButtonLabelProps} from './thumbButtonLabel';
import {ThumbButtonIcon, ThumbButtonIconProps} from './thumbButtonIcon';

import '../../../styles/thumbs.scss';
// import {Tooltip, TooltipId} from '../../tooltip';
import classNames from 'classnames';

interface ThumbsButtonProps {
  highlightable?: boolean;
  iconOptions?: ThumbButtonIconProps;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  textOptions?: ThumbButtonLabelProps;
  onContentLoaded?: () => void;
  // tooltipId?: TooltipId;
}

const ThumbButton: FunctionComponent<ThumbsButtonProps> = ({
  highlightable = true,
  iconOptions,
  onClick,
  textOptions,
  onContentLoaded,
  // tooltipId,
}) => {
  const button = (
    <div
      // Allows this to be detected as 'relatedTarget' for focus events like onBlur()
      tabIndex={-1}
      className={classNames('thumb-content', {
        'thumb-button--text-and-icon': iconOptions && textOptions,
        'thumb-button-highlightable': highlightable,
        'thumb-button--only-icon': iconOptions && !textOptions,
        'thumb-button--only-text': !iconOptions && textOptions,
      })}
      onClick={onClick}
      ref={
        !iconOptions
          ? onContentLoaded
          : () => {
              // no action
            }
      }
    >
      {iconOptions && (
        <ThumbButtonIcon {...iconOptions} onContentLoaded={onContentLoaded} />
      )}
      {textOptions && <ThumbButtonLabel {...textOptions} />}
    </div>
  );

  // return !!tooltipId ? (
  //   <Tooltip
  //     contentId={tooltipId}
  //     placement="top"
  //     className="tooltip--no-title"
  //     hideOnClick={true}
  //   >
  //     {button}
  //   </Tooltip>
  // ) : (
  //   button
  // );
  return (button);
};

export {ThumbButton};
