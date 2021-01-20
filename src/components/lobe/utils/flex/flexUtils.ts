/*
 * ------------------------------------------------------------------------
 *
 *  Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * ------------------------------------------------------------------------
 */

import _, {isEmpty} from 'lodash';
// import {
//   ImageDataItemFragment,
//   StringDataItemFragment,
//   NumberDataItemFragment,
//   VectorDataItemFragment,
//   BaseDatasetExample,
//   DatasetExampleType,
//   DatasetExample,
// } from '@lobe/shared/dist/types/dataItemFragment';
// import {FlexExample} from '@lobe/shared/dist/types/flexDataset';
import styles from '../../../../styles/flexLayout.scss';
// import {FlexGridLayout, FlexRow, FlexTarget} from './flexLayout';
// import DataConstants from '@lobe/shared/dist/constants/data';
// import {LabelPrediction, Prediction} from '@lobe/shared/dist/types/evaluate';
// import Strings from '@lobe/shared/assets/strings/lobeStrings.json';
// import {ExampleUpload, ExampleId} from '@lobe/shared/dist/types/example';
// import {
//   UploadImageInput,
//   UploadStringInput,
// } from '@lobe/shared/dist/types/data';

export const MIN_ROW_HEIGHT = parseFloat(styles.MIN_ROW_HEIGHT);
export const IDEAL_ROW_HEIGHT = parseFloat(styles.IDEAL_ROW_HEIGHT);
export const MAX_ROW_HEIGHT = parseFloat(styles.MAX_ROW_HEIGHT);
export const MIN_ASPECT_RATIO = parseFloat(styles.MIN_ASPECT_RATIO);
export const HEADER_HEIGHT = parseFloat(styles.HEADER_HEIGHT);
export const TILE_MARGIN = parseFloat(styles.TILE_MARGIN);
export const NO_HEADER_TOP = parseFloat(styles.NO_HEADER_TOP);
export const BORDER_WIDTH = parseFloat(styles.BORDER_WIDTH);

export enum DataItemLabelPredictionType {
  None = 'None',
  Correct = 'Correct',
  Incorrect = 'Incorrect',
  Loading = 'Loading',
}

export interface PredictedLabelInfo {
  label: string | number;
  accuracy: number;
  predictionType: DataItemLabelPredictionType;
}

// export const findExampleLabel = (example: BaseDatasetExample): string => {
//   if (example.exampleType === DatasetExampleType.Labeled) {
//     return _.first(findExampleLabels(example as DatasetExample));
//   }

//   return undefined;
// };

// // find the label for an example
// export const findExampleLabels = (example: DatasetExample): string[] => {
//   try {
//     for (const target of example.targets) {
//       const string = (target as StringDataItemFragment).string;
//       if (string) {
//         return [string];
//       }
//       const number = (target as NumberDataItemFragment).number;
//       if (number) {
//         return [String(number)];
//       }
//       const vector = (target as VectorDataItemFragment).vector;
//       if (vector) {
//         for (const data of vector.data) {
//           if (typeof data === 'string') {
//             return vector.data as string[];
//           }
//         }
//       }
//     }
//   } catch (e) {
//     console.error('findExampleLabels (example): ', example);
//     if (example) {
//       console.error('findExampleLabels (example.targets): ', example.targets);
//     }
//     throw e;
//   }
// };

// export function findPredictedLabel(
//   {predictions}: BaseDatasetExample,
//   actualLabel: string,
//   showLoading = true,
// ): PredictedLabelInfo {
//   const labelPrediction = !isEmpty(predictions)
//     ? (predictions.find(
//         prediction => prediction.dataType === DataConstants.TEXT_TYPE,
//       ) as LabelPrediction)
//     : undefined;

//   if (labelPrediction) {
//     const {label: predictedLabel, confidence: accuracy} = labelPrediction;
//     let predictionType: DataItemLabelPredictionType =
//       DataItemLabelPredictionType.None;
//     if (actualLabel) {
//       if (predictedLabel === actualLabel) {
//         predictionType = DataItemLabelPredictionType.Correct;
//       } else {
//         predictionType = DataItemLabelPredictionType.Incorrect;
//       }
//     }
//     return {label: predictedLabel, accuracy, predictionType};
//   } else if (showLoading) {
//     return {
//       label: Strings.Evaluate.PredictionLoadingLabel,
//       accuracy: 0,
//       predictionType: DataItemLabelPredictionType.Loading,
//     };
//   }
// }

// // find the image for an example
// export const findExampleImage = (
//   example: BaseDatasetExample,
// ): ImageDataItemFragment => {
//   for (const input of example.inputs) {
//     const imageInput = input as ImageDataItemFragment;
//     if (imageInput.image) {
//       const ret = {...imageInput};
//       if (!ret.image.height) {
//         ret.image.height = IDEAL_ROW_HEIGHT;
//       }
//       if (!ret.image.width) {
//         ret.image.width = IDEAL_ROW_HEIGHT;
//       }
//       return ret;
//     }
//   }
// };

// // create FlexExample from DatasetExample
// export function exampleToFlex(
//   example: BaseDatasetExample,
//   predictions: Prediction[] = [],
// ): FlexExample {
//   const image = findExampleImage(example);
//   if (image) {
//     return {
//       example: {...example, predictions} as DatasetExample,
//       image: image.image,
//     };
//   }
// }

// // check to see if all images are the same size
// export function imagesAreUniform(images: FlexExample[]): boolean {
//   const {width: imgWidth, height: imgHeight} = images[0].image;
//   for (const image of images) {
//     if (image.image.height !== imgHeight || image.image.width !== imgWidth) {
//       return false;
//     }
//   }
//   return true;
// }

// // given an item index, find the row of the flex grid layout that the
// // item is in, and return its vertical offset.
// export function findFlexRowIndex(
//   itemIndex: number,
//   layout: FlexGridLayout,
// ): number {
//   let index = 0;
//   if (layout && itemIndex) {
//     for (const row of layout.rows) {
//       if (rowContainsIndex(itemIndex, row)) {
//         return index;
//       }
//       index++;
//     }
//   }
//   return index;
// }

// // check if a flex grid row contains a given item index
// export function rowContainsIndex(itemIndex: number, row: FlexRow) {
//   return itemIndex >= row.startIndex && itemIndex <= row.endIndex;
// }

// export function flatExamplesMap(
//   sections: FlexTarget[],
// ): Record<ExampleId, DatasetExample> {
//   const map: Record<ExampleId, DatasetExample> = {};
//   sections.forEach(section => {
//     section.examples.forEach(
//       example => (map[example.example.id] = example.example),
//     );
//   });
//   return map;
// }
