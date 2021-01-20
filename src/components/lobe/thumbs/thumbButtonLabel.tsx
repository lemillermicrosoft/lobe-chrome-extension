/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import React, {FunctionComponent} from 'react';

export interface ThumbButtonLabelProps {
  text: string;
  animate?: boolean;
}

const ThumbButtonLabel: FunctionComponent<ThumbButtonLabelProps> = ({
  text,
  animate = false,
}) => {
  return (
    <span
      className={`thumb-button-text ${
        animate && 'thumb-button-text-animateIn'
      }`}
    >
      {text}
    </span>
  );
};

export {ThumbButtonLabel};
