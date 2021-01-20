/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import React, {CSSProperties, FC, useCallback, useContext} from 'react';
import classnames from 'classnames';

import {TypeaheadContext} from './typeahead';

import labelPillStyles from '../../../styles/labelPill.scss';
import '../../../styles/typeaheadMenu.scss';
import {TypeaheadMenuItem} from './typeaheadMenuItem';

export const MAX_SUGGESTIONS = 3;

 const labelPillContainerHeight = 48;
//parseInt(
//   labelPillStyles.labelPillcontainerheight,
// );

interface TypeaheadMenuSharedProps {
  onSelect?: (value: React.ReactText) => void;
}

interface TypeaheadMenuProps {
  reverseMenu?: boolean;

  options?: React.ReactText[];
  selectedOption?: React.ReactText;
}

export const TypeaheadMenu: FC<
  TypeaheadMenuProps & TypeaheadMenuSharedProps
> = ({onSelect, options: _options, reverseMenu, selectedOption: selected}) => {
  const clonedOptions = _options ? _options.slice() : null;
  const options = (reverseMenu ? clonedOptions.reverse() : clonedOptions).slice(
    0,
    MAX_SUGGESTIONS,
  );

  const marginBetweenTypeaheadAndMenu = 5;
  const typeaheadMenuHeightWithMarginAdded =
    labelPillContainerHeight + marginBetweenTypeaheadAndMenu;
  const containerStyle: CSSProperties = {
    marginTop: reverseMenu ? 0 : typeaheadMenuHeightWithMarginAdded,
    marginBottom: reverseMenu ? typeaheadMenuHeightWithMarginAdded : 0,
  };

  const menuStyles: CSSProperties = {
    transformOrigin: reverseMenu ? 'bottom left' : 'top left',
  };

  return (
    <div
      className={classnames('typeahead-menu-v2-container', {
        reversed: reverseMenu,
      })}
      style={containerStyle}
    >
      <ol className="typeahead-menu-v2" role="listbox" style={menuStyles}>
        {options.map(option => (
          <TypeaheadMenuItem
            key={`typeahead-menu-item-${option}`}
            option={option}
            selected={selected === option}
            onSelect={onSelect}
          />
        ))}
      </ol>
    </div>
  );
};

export const WrappedTypeaheadMenu: FC<Omit<
  TypeaheadMenuSharedProps,
  'onSelect'
>> = props => {
  const {
    matchedOptions,
    reverseMenu,
    selectedOption,
    showMenu,
    dispatch,
  } = useContext(TypeaheadContext);

  const onSelect = useCallback(
    (option: React.ReactText) => {
      dispatch({type: 'SET', source: {type: 'menu'}, value: option});
    },
    [dispatch],
  );

  return (
    showMenu && (
      <TypeaheadMenu
        {...props}
        options={matchedOptions}
        reverseMenu={reverseMenu}
        selectedOption={selectedOption}
        onSelect={onSelect}
      />
    )
  );
};
