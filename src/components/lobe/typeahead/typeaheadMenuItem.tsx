/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import React, { FC, useCallback } from "react";
import { useSpring } from "react-spring";
import VisibilitySensor from "react-visibility-sensor";

import { LabelPill } from "../labelPill/labelPill";
import classNames from "classnames";

export const TYPEAHEAD_MENU_ITEM_CLASSNAME = "typeahead-option";

interface TypeaheadMenuItemProps {
  selected?: boolean;
  option?: React.ReactText;
  onSelect?: (value: React.ReactText) => void;
}

const TypeaheadMenuItem: FC<TypeaheadMenuItemProps> = ({
  selected,
  option,
  onSelect,
}) => {
  const onClick = useCallback(() => {
    onSelect && onSelect(option);
  }, [onSelect, option]);

  return (
    <li
      className={classNames("typeahead-option", {
        "typeahead-option--selected": selected,
      })}
      role="option"
      aria-selected={selected}
      // Allows this to be detected as 'relatedTarget' for focus events like onBlur()
      tabIndex={-1}
      onClick={onClick}
    >
        <LabelPill
          value={option}
          asOption={true}
          readOnly={true}
        />
    </li>
  );
};

export { TypeaheadMenuItem };
