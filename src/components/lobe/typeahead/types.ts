/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import {FocusEvent} from 'react';

import {ProjectLabelValueType} from '../types/dataset';
import {LabelPillScale} from '../labelPill/types';

/**
 * TypeaheadStatus
 *
 * IDLE: Intial state and reset state. Nothing typed.
 * TYPING: User typed or used arrows
 * NAVIGATING: User is navigating TypeaheadMenu options using arrows
 *
 */
export type TypeaheadStatus = 'IDLE' | 'TYPING' | 'NAVIGATING';

export type TypeaheadSetSource =
  | {type: 'menu'}
  | {type: 'input'}
  | {type: 'blur'; event: FocusEvent<HTMLInputElement>};

export interface TypeaheadState {
  status: TypeaheadStatus;
  // Show or hide TypeaheadMenu
  showMenu: boolean;
  // Matched options based on typed value
  matchedOptions: ProjectLabelValueType[];
  // Current input value
  value: ProjectLabelValueType;
  scale: LabelPillScale;

  label?: ProjectLabelValueType;
  // All options
  options?: ProjectLabelValueType[];
  // Selected option while NAVIGATING
  selectedOption?: ProjectLabelValueType;
  reverseMenu?: boolean;

  onSet?: (value: ProjectLabelValueType, source: TypeaheadSetSource) => void;
  onChange?: (value: ProjectLabelValueType) => void;
  onNavigate?: (value: ProjectLabelValueType) => void;
  onCancel?: () => void;
}

export type NavigationDirection = 'UP' | 'DOWN';

export type TypeaheadAction =
  // Arrow navigation in the TypeaheadMenu (Up/Down)
  | {
      type: 'NAVIGATE';
      direction: NavigationDirection;
    }
  | {type: 'CANCEL'}
  // Triggered when the input is focused
  | {type: 'FOCUS'}
  // Keystrokes in the input
  | {type: 'TYPE'}
  // Input string changes
  | {
      type: 'CHANGE';
      value: ProjectLabelValueType;
      selectSuggestedOption?: boolean;
    }
  // Sets the value for the input
  | {type: 'SET'; source: TypeaheadSetSource; value?: ProjectLabelValueType};
