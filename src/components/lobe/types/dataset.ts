/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

// import {AccuracyRatio} from '@lobe/shared/dist/types/evaluate';\
export interface AccuracyRatio {
  correct: number;
  incorrect: number;
  untested: number;
}

export type FileUploadType = DataTransferItemList | FileList | File[];

export enum ProjectLabelType {
  ALL_LABELS = 'ALL_LABELS',
  UNLABELED = 'UNLABELED',
  EMPTY_LABEL = 'EMPTY',
  USER_LABEL = 'USER_LABEL',
}

export type ProjectLabelValueType = string | number;

export interface BaseProjectLabel {
  label: string; // TODO: string|number
  type: ProjectLabelType;
}

export interface ProjectLabel extends BaseProjectLabel {
  range?: {min: number; max: number};
  itemCount: number;
  accuracy: AccuracyRatio;
  type: ProjectLabelType;
}

// export const EMPTY_LABEL: ProjectLabel = {
//   label: '',
//   range: null,
//   itemCount: 0,
//   accuracy: undefined,
//   type: ProjectLabelType.EMPTY_LABEL,
// };
