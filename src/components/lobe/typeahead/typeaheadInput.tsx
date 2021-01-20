/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

// import {
//   ActionContextMenuPayload,
//   ContextMenuOption,
// } from '@lobe/shared/dist/types/flags';

import {each} from 'lodash';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  MutableRefObject,
  useContext,
  FocusEventHandler,
} from 'react';

// import {KeyCodes} from '@lobe/shared/dist/constants/keyCodes';
// import LobeStrings from '@lobe/shared/assets/strings/lobeStrings.json';
// import {useLobeDispatch} from '../../../lobeRedux';
import {LabelPill} from '../labelPill';
import {TypeaheadContext} from './typeahead';
import {TYPEAHEAD_MENU_ITEM_CLASSNAME} from './typeaheadMenuItem';
// import {CONTEXT_MENU_ITEM_CLASSNAME} from '../contextMenu/contextMenuItem';
import {TypeaheadSetSource} from './types';
import {ProjectLabelValueType} from '../types/dataset';
// import {cmdOrCtrlPressed, shiftPressed} from '../hotkeys/baseHotkeys';

// const {ContextMenu} = LobeStrings;

interface TypeaheadInputProps {
  inputRef?: MutableRefObject<HTMLInputElement>;

  highlight?: boolean;

  // Selectors for elements which trigger blur() events which shouldn't cancel value. eg. Clicking 'Add' button in Play controls
  ignoredBlurSourceSelectors?: string[];
  selectNextExample?: () => void;

  // Ignores arrow key navigation if the input is empty. This can be useful for suppressing the TypeaheadMenu
  ignoreArrowKeys?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onInputChange?: (value: ProjectLabelValueType) => void;
}
// Hook for handling keydown events from TypeaheadInput
function useTypeaheadOnKeyDown(ignoreArrowKeysIfEmpty: boolean) {
  const {status, showMenu, dispatch} = useContext(TypeaheadContext);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, value?: ProjectLabelValueType) => {
      // if (
      //   !(cmdOrCtrlPressed() || shiftPressed()) &&
      //   (e.keyCode === KeyCodes.DOWN_ARROW || e.keyCode === KeyCodes.UP_ARROW)
      // ) {
      //   const ignoreArrowsAndEmpty = ignoreArrowKeysIfEmpty && !value;
      //   if (!showMenu && ignoreArrowsAndEmpty) {
      //     return;
      //   }

      //   // If the menu is up stop propagation
      //   if (showMenu) {
      //     e.stopPropagation();
      //     e.nativeEvent.stopImmediatePropagation();
      //   }

      //   dispatch({
      //     type: 'NAVIGATE',
      //     direction: e.keyCode === KeyCodes.UP_ARROW ? 'UP' : 'DOWN',
      //   });
      // } else if (e.keyCode === KeyCodes.ESCAPE) {
      //   dispatch({type: 'CANCEL'});
      // } else if (e.keyCode === KeyCodes.ENTER || e.keyCode === KeyCodes.TAB) {
      //   // This can be triggered while navigating the menu or typing.
      //   // Deteremine which based on the status.
      //   const source: TypeaheadSetSource =
      //     status === 'NAVIGATING' ? {type: 'menu'} : {type: 'input'};
      //   dispatch({type: 'SET', source, value});
      // }
    },
    [showMenu, dispatch, status, ignoreArrowKeysIfEmpty],
  );

  return onKeyDown;
}

export const TypeaheadInput: FC<TypeaheadInputProps> = ({
  onBlur: onBlurProp,
  onInputChange: onInputChangeProp,
  highlight,
  ignoredBlurSourceSelectors,
  ignoreArrowKeys: ignoreArrowKeysIfEmpty = false,
  selectNextExample,
}) => {
  const {
    selectedOption,
    value,
    matchedOptions,
    status,
    dispatch: typeaheadDispatch,
    scale,
    label,
  } = useContext(TypeaheadContext);

  // Hook that ties into TypeaheadContext for key strokes
  const typeaheadOnKeyDown = useTypeaheadOnKeyDown(ignoreArrowKeysIfEmpty);

  // Determines whether autocompletion will happen in the input
  const [autocomplete, setAutocomplete] = useState(false);

  const inputRef = useRef<HTMLInputElement | undefined>();
  // const dispatch = useLobeDispatch();

  // Focus the input on mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const isReady = useMemo(() => status !== 'NAVIGATING', [status]);
  const match = useMemo(() => matchedOptions[0], [matchedOptions]);

  const suggested = useMemo(() => {
    let suggested = value;

    if (!isReady) {
      suggested = label;
    } else if (value && autocomplete) {
      if (!match) {
        setAutocomplete(false);
      } else {
        suggested = match;
      }
    }

    console.debug(`TypeaheadInput: suggested:${suggested} isReady:${isReady}`);
    return suggested;
  }, [label, match, isReady, value, autocomplete]);

  // Select the rest of the label when autocompleting
  useEffect(() => {
    if (
      isReady &&
      inputRef.current &&
      value &&
      suggested &&
      value !== suggested
    ) {
      const start = value.toString().length;
      const end = suggested.toString().length;
      inputRef.current.setSelectionRange(start, end);
    }
  }, [value, suggested, inputRef, isReady]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();

      const {keyCode} = e;

      // if (
      //   [KeyCodes.LEFT_ARROW, KeyCodes.RIGHT_ARROW].includes(keyCode) &&
      //   !!value
      // ) {
      //   console.info(`TypeaheadInput: onKeyDown LEFT/RIGHT keycode:${keyCode}`);
      //   typeaheadDispatch({
      //     type: 'CHANGE',
      //     value: suggested,
      //     selectSuggestedOption: true,
      //   });
      //   setAutocomplete(false);
      // } else if (
      //   keyCode === KeyCodes.TAB &&
      //   !label &&
      //   !value &&
      //   selectNextExample
      // ) {
      //   selectNextExample();
      //   return;
      // }

      typeaheadOnKeyDown(e, autocomplete ? suggested : null);
    },
    [
      autocomplete,
      suggested,
      typeaheadOnKeyDown,
      typeaheadDispatch,
      value,
      label,
      selectNextExample,
    ],
  );

  const onClick = useCallback(() => {
    typeaheadDispatch({type: 'FOCUS'});
  }, [typeaheadDispatch]);

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (event.relatedTarget) {
        const el = event.relatedTarget as HTMLElement;

        // // Ignore blur event from context menu options clicks. eg. cut, copy, paste
        // if (el.className === CONTEXT_MENU_ITEM_CLASSNAME) {
        //   event.stopPropagation();
        //   return;
        // }
        const ignoredSelectors = [
          `.${TYPEAHEAD_MENU_ITEM_CLASSNAME}`,
          ...(ignoredBlurSourceSelectors || []),
        ];

        // Check for ignored selector for relatedTargets. ie. Menu option click, etc.
        let isIgnored = false;
        each(ignoredSelectors, ignoredSelector => {
          isIgnored = !!el.closest(ignoredSelector);
          console.debug(
            `TypeaheadInput: onBlur() ignoredSelector:${ignoredSelector} isIgnored:${isIgnored}`,
          );

          if (isIgnored) {
            inputRef.current.focus();
            return false;
          }
        });

        // If we have an ignored scenario we should prevent setting or
        // cancelling so that the behavior can be handled elsewhere
        if (isIgnored) {
          return;
        }
      }

      if (status === 'TYPING' || status === 'NAVIGATING') {
        typeaheadDispatch({
          type: 'SET',
          source: {type: 'blur', event},
          value: autocomplete ? suggested : null,
        });
      } else {
        typeaheadDispatch({
          type: 'CANCEL',
        });
      }

      onBlurProp && onBlurProp(event);
    },
    [
      autocomplete,
      status,
      ignoredBlurSourceSelectors,
      onBlurProp,
      suggested,
      typeaheadDispatch,
    ],
  );

  const onFocus = useCallback(() => {
    inputRef.current.select();
  }, []);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const {
        target: {value: newValue},
      } = e;
      console.debug(
        `TypeaheadInput: onChange value:${value} newValue:${newValue}`,
      );

      const inputString = value.toString();
      const hitBackspace =
        inputString.length > newValue.length &&
        inputString.startsWith(newValue);
      const isNewLabelEmpty = !newValue.toString().length;

      let newAutoCompleteValue: boolean;
      if (value !== suggested && value === newValue) {
        console.debug(`TypeaheadInput: onChange delete autocomplete`);
        newAutoCompleteValue = false;
      } else if (hitBackspace || isNewLabelEmpty) {
        console.debug(`TypeaheadInput: onChange delete`);
        newAutoCompleteValue = false;
      } else {
        newAutoCompleteValue = true;
      }
      setAutocomplete(newAutoCompleteValue);

      typeaheadDispatch({
        type: 'CHANGE',
        value: newValue,
        selectSuggestedOption: newAutoCompleteValue,
      });
    },
    [value, suggested, typeaheadDispatch],
  );

  // Stop the event from propagating when the input is focused.
  const onDoubleClick = useCallback((e: MouseEvent) => e.stopPropagation(), []);

  const onContextMenuClick = useCallback(
    (e: React.MouseEvent, command: 'cut' | 'copy' | 'paste') => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      console.log(`TypeaheadInput: contextMenu click ${command}`);
      document.execCommand(command);
      inputRef.current.focus();
    },
    [inputRef],
  );

  const onContextMenu = useCallback(
    (e: MouseEvent) => {
      const {pageX: x, pageY: y} = e;

      console.log(`TypeaheadInput: contextMenu shown`);

      e.stopPropagation();

      // const options: ContextMenuOption[] = [
      //   {
      //     label: ContextMenu.DatasetItemLabel.Cut,
      //     onClick: e => onContextMenuClick(e, 'cut'),
      //   },
      //   {
      //     label: ContextMenu.DatasetItemLabel.Copy,
      //     onClick: e => onContextMenuClick(e, 'copy'),
      //   },
      //   {
      //     label: ContextMenu.DatasetItemLabel.Paste,
      //     onClick: e => onContextMenuClick(e, 'paste'),
      //   },
      // ];

      // const payload: ActionContextMenuPayload = {
      //   x,
      //   y,
      //   options,
      // };

      // dispatch({
      //   type: 'PUSH_CONTEXT_MENU',
      //   payload,
      // });
    },
    [/*dispatch,*/ onContextMenuClick],
  );

  let inputValue = label;
  if (status === 'NAVIGATING') {
    inputValue = selectedOption;
  } else if (status === 'TYPING') {
    inputValue = suggested;
  }

  useEffect(() => {
    if (inputValue !== undefined) {
      onInputChangeProp && onInputChangeProp(inputValue);
    }
  }, [inputValue, onInputChangeProp]);

  return (
    <LabelPill
      inputRef={inputRef}
      value={inputValue}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      scale={scale}
      highlight={highlight}
    />
  );
};
