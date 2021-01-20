/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import React, {FC, createContext, useReducer, Dispatch, useMemo} from 'react';

import {ProjectLabelValueType} from '../types/dataset';
import {LabelPillScale} from '../labelPill/types';
import {TypeaheadState, TypeaheadAction, TypeaheadSetSource} from './types';
import {
  initialState,
  getFocusState,
  getNavigateState,
  getChangeState,
  getSetState,
  getDefaultMatches,
  // useTypeaheadScaleMultiplier,
} from './utils';

import '../../../styles/typeahead.scss';

interface TypeaheadProps {
  label?: ProjectLabelValueType;
  options?: ProjectLabelValueType[];

  className?: string;
  reverseMenu?: boolean;
  scale?: LabelPillScale;
  // Shows TypeaheadMenu when Typeahead is mounted
  showMenuOnMount?: boolean;

  // Triggered once a value is set for the input
  onSet?: (value: ProjectLabelValueType, source: TypeaheadSetSource) => void;
  onChange?: (value: ProjectLabelValueType) => void;
  onNavigate?: (value: ProjectLabelValueType) => void;
  onCancel?: () => void;
}

interface TypeaheadContextState extends TypeaheadState {
  dispatch: Dispatch<TypeaheadAction>;
  scaleMultiplier: number;
}

export const TypeaheadContext = createContext<TypeaheadContextState>(null);

const Typeahead: FC<TypeaheadProps> = ({
  children,
  label,
  options: allOptions,
  reverseMenu,
  showMenuOnMount,
  scale = LabelPillScale.MEDIUM,
  onSet: onSubmit,
  onChange,
  onNavigate,
  onCancel,
  className,
}) => {
  const reducer: (
    state: TypeaheadState,
    action: TypeaheadAction,
  ) => TypeaheadState = (state, action) => {
    console.debug(`Typeahead: Reducer action:`, action);
    console.debug(`Typeahead: Reducer state:`, state);

    let nextState: TypeaheadState;
    switch (action.type) {
      case 'FOCUS':
        nextState = getFocusState(state);
        break;
      case 'NAVIGATE':
        nextState = getNavigateState(state, action.direction);
        onNavigate && onNavigate(nextState.selectedOption);
        break;
      case 'CANCEL':
        onCancel && onCancel();

        nextState = {
          ...state,
          ...initialState,
        };
        break;
      case 'TYPE':
        nextState = {
          ...state,
          status: 'TYPING',
        };
        break;
      case 'CHANGE':
        nextState = getChangeState(
          state,
          action.value,
          action.selectSuggestedOption,
        );
        onChange && onChange(nextState.value);
        break;
      case 'SET':
        nextState = getSetState(state, action.source, action.value);
        onSubmit && onSubmit(nextState.value, action.source);
        break;
      default:
        nextState = state;
    }

    console.debug(`Typeahead: Reducer nextState:`, nextState);
    return nextState;
  };

  const matchedOptions = getDefaultMatches(allOptions, label);
  // Typeahead menu selected prediction based on the value rather than index
  // in order to do this independent of ordering (normal / reverse)
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    label,
    options: allOptions,
    matchedOptions,
    selectedOption: matchedOptions[0] === label ? matchedOptions[0] : undefined,
    showMenu: showMenuOnMount && matchedOptions.length > 0,
    reverseMenu,
  });

  const contextValue = useMemo(() => {
    return {...state, dispatch};
  }, [state, dispatch]);

  // const scaleMultiplier = useTypeaheadScaleMultiplier(scale);
  const scaleMultiplier = 1;

  return (
    <div
      className={`typeahead-container ${className || ''}`}
      style={{
        transform: `scale(${scaleMultiplier})`,
      }}
    >
      <TypeaheadContext.Provider
        value={{...contextValue, reverseMenu, scaleMultiplier}}
      >
        {children}
      </TypeaheadContext.Provider>
    </div>
  );
};

export {Typeahead};
