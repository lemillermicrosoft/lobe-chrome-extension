/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import {LabelPillScale} from '../labelPill/types';
import {ProjectLabelValueType} from '../types/dataset';
import {TypeaheadState, NavigationDirection, TypeaheadSetSource} from './types';
import {without} from 'lodash';
// import {useLobeSelector} from '../../lobe/lobeRedux';
// import {getLabelScaleMultiplier} from '../labelPill/utils';

export const MAX_SUGGESTIONS = 3;

export const initialState: TypeaheadState = {
  status: 'IDLE',
  showMenu: false,
  matchedOptions: [],
  selectedOption: undefined,
  value: '',
  scale: LabelPillScale.MEDIUM,
};

export function findMatches(
  value: ProjectLabelValueType,
  options: ProjectLabelValueType[],
): ProjectLabelValueType[] {
  const typedValue = value.toString().toLocaleLowerCase();
  const matches = options.filter(option => {
    const lowerCaseOption = option.toString().toLocaleLowerCase();
    return lowerCaseOption.startsWith(typedValue);
  });
  console.debug(`Typeahead: findMatches() matches:`, matches);
  return matches.slice(0, MAX_SUGGESTIONS);
}

export function getDefaultMatches(
  options?: ProjectLabelValueType[],
  label?: ProjectLabelValueType,
): ProjectLabelValueType[] {
  if (options) {
    const optionsWithLabelFirst = [
      ...(label ? [label] : []),
      ...without(options, label),
    ];

    return optionsWithLabelFirst.slice(0, MAX_SUGGESTIONS);
  }

  return [];
}

// Returns next option given options and current selectedOption
export function getNextOption(
  options: ProjectLabelValueType[],
  selectedOption: ProjectLabelValueType,
) {
  const index = options.indexOf(selectedOption);
  return options[(index + 1) % options.length];
}

// Returns previous option given options and current selectedOption
export function getPreviousOption(
  options: ProjectLabelValueType[],
  selectedOption: ProjectLabelValueType,
) {
  const index = options.indexOf(selectedOption);
  return options[(index - 1 + options.length) % options.length];
}

export function getFocusState(state: TypeaheadState): TypeaheadState {
  const {options, label, value} = state;

  const matchedOptions = getDefaultMatches(options, label || value);

  return {
    ...state,
    showMenu: matchedOptions.length > 0,
    matchedOptions,
  };
}

export function getNavigateState(
  state: TypeaheadState,
  direction: NavigationDirection,
): TypeaheadState {
  const {showMenu, reverseMenu, selectedOption, matchedOptions} = state;
  // If there are no options then keep state unchanged
  if (!matchedOptions.length) {
    return state;
  }

  let newSelectedOption = selectedOption || matchedOptions[0];

  if (showMenu) {
    if (direction === 'UP') {
      newSelectedOption = reverseMenu
        ? getNextOption(matchedOptions, selectedOption)
        : getPreviousOption(matchedOptions, selectedOption);
    } else {
      newSelectedOption = reverseMenu
        ? getPreviousOption(matchedOptions, selectedOption)
        : getNextOption(matchedOptions, selectedOption);
    }
  }

  return {
    ...state,
    status: 'NAVIGATING',
    showMenu: true,
    selectedOption: newSelectedOption,
  };
}

export function getChangeState(
  state: TypeaheadState,
  value: ProjectLabelValueType,
  selectSuggestedOption?: Boolean,
): TypeaheadState {
  const {options} = state;

  const matchedOptions = findMatches(value, options);

  return {
    ...state,
    status: 'TYPING',
    value,
    showMenu: !!matchedOptions.length,
    matchedOptions,
    selectedOption: selectSuggestedOption ? matchedOptions[0] : undefined,
  };
}

export function getSetState(
  state: TypeaheadState,
  source: TypeaheadSetSource,
  submittedValue?: ProjectLabelValueType,
): TypeaheadState {
  const {status, selectedOption, value} = state;

  let newValue: ProjectLabelValueType;
  if (status === 'NAVIGATING') {
    newValue = submittedValue || selectedOption;
  } else {
    newValue = submittedValue || value;
  }

  return {
    ...state,
    ...initialState,
    value: newValue,
  };
}

// export function useTypeaheadScaleMultiplier(scale: LabelPillScale) {
//   const longestLabelLength = useLobeSelector(
//     state => state.labels.longestLabelLength,
//   );
//   return getLabelScaleMultiplier(longestLabelLength, scale);
// }
