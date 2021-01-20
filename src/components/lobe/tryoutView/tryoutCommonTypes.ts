/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

// import Strings from '@lobe/shared/assets/strings/lobeStrings.json';

/**
 * Note: TryoutTabs are a 1:1 match with TryoutUploadSource. Should TryoutTabs
 * change, make sure to update TryoutUploadSource if necessary.
 * Reminder: String enums !== strings, so don't try it :)
 *  */
export const TryoutTabs = {
  Images: "Images",//Strings.ContentHeaders.Tryout.SwitcherLabelImages,
  Webcam: "Webcam",//Strings.ContentHeaders.Tryout.SwitcherLabelWebcam,
};

// Note: Don't localize these strings since they are logged.
export enum TryoutUploadSource {
  Image = 'Image',
  Webcam = 'Camera',
}

export interface TryoutImageUpload {
  label: string;
  dataUrl: string;
  source: TryoutUploadSource;
}

export enum TryoutLabelingState {
  None = 'None',
  Labeling = 'Labeling',
  Labeled = 'Labeled',
}

export interface TryoutCommonUploadProps {
  onSubmit: (upload: TryoutImageUpload) => void;
}

export interface TryoutCommonStateProps {
  labelingState: TryoutLabelingState;
  setLabelingState: (labelingState: TryoutLabelingState) => void;
}
