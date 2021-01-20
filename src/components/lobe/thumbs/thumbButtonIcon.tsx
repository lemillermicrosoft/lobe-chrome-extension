/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import React, {FunctionComponent} from 'react';

export interface ThumbButtonIconProps {
  icon: string;
  animate?: boolean;
  onContentLoaded?: () => void;
}

const ThumbButtonIcon: FunctionComponent<ThumbButtonIconProps> = ({
  icon,
  animate = false,
  onContentLoaded,
}) => {
  return (
    <img
      className={`thumb-button-icon ${
        animate && 'thumb-button-icon-animateIn'
      }`}
      draggable={false}
      onLoad={onContentLoaded}
      src={icon}
    />
  );
};

export {ThumbButtonIcon};
