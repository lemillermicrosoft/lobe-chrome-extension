/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

export enum ThumbButtonTypes {
  ThumbsUp = 'ThumbsUp',
  ThumbsDown = 'ThumbsDown',
  Add = 'Add',
  Added = 'Added',
}

export interface ThumbsButtonCommonProps {
  onClick?: ThumbsClickCallback;
}

export type ThumbsClickCallback = (type: ThumbButtonTypes) => void;
