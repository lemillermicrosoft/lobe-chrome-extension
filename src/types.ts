// Popup or options script requesting the current status
export interface ProjectRequest {
  type: "GET_SELECTED_PROJECT";
}

// Background script broadcasting current status
export interface ProjectResponse {
  type: "SELECTED_PROJECT";
  id: string;
  selectionLabel: string;
}

// Options requesting background script for status change
export interface ProjectSelect {
  type: "SELECT_PROJECT";
  id: string;
  selectionLabel: string;
}

export interface ConvertImageUrlRequest {
  type: "CONVERT_IMAGE_URL_TO_DATA_URL";
  url: string;
}
export interface GetProjectsRequest {
  type: "GET_PROJECTS";
}

export interface GetLabelsRequest {
  type: "GET_SOME_LABELS";
  projectId: string;
}

export interface PostPredictionRequest {
  type: "POST_PREDICTION";
  base64Image: string;
  projectId: string;
  label: string;
}

export interface GetPredictionRequest {
  type: "GET_PREDICTION";
  base64Image: string;
  projectId: string;
}

export type MessageType =
  | ProjectRequest
  | ProjectResponse
  | ProjectSelect
  | ConvertImageUrlRequest
  | GetProjectsRequest
  | GetProjectsRequest
  | GetLabelsRequest
  | PostPredictionRequest
  | GetPredictionRequest;
