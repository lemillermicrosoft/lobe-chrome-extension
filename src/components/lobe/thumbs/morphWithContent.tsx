/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import React, {
  FunctionComponent,
  useRef,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from 'react';

import '../../../styles/thumbs.scss';

export enum ThumbButtonColor {
  Green = 'green',
  Red = 'red',
}

interface MorphWithContentProps {
  callback?: () => void;
  children: ReactNode;
  hide?: boolean;
  color?: ThumbButtonColor;
}

const MorphWithContent: FunctionComponent<MorphWithContentProps> = ({
  children,
  hide,
  color,
}) => {
  const containerRef = useRef(null);
  const [goToWidth, setGoToWidth] = useState<number>(null);

  const onContentLoaded = useCallback(() => {
    const {current = undefined} = containerRef;
    if (current) {
      setGoToWidth(current.clientWidth);
    }
  }, []);

  const childComponent = useMemo(() => {
    return React.Children.map(children, child =>
      React.cloneElement(child as React.ReactElement, {onContentLoaded}),
    );
  }, [children, onContentLoaded]);

  let style;
  if (goToWidth && !hide) {
    style = {
      width: goToWidth || 'auto',
    };
  } else {
    style = {
      height: 0,
      width: 0,
      opacity: 0,
      padding: 0,
      margin: 0,
      transform: 'scale(0)',
    };
  }

  return (
    <>
      <div className={`thumb-button thumb-button--${color}`} style={style}>
        {children}
      </div>

      {/* mount content hidden so we can get it's content width and scale to it */}
      <div className="hidden-container" ref={containerRef}>
        {childComponent}
      </div>
    </>
  );
};

export {MorphWithContent};
