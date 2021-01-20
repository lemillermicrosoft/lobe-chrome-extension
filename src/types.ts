// Popup or options script requesting the current status
interface ProjectRequest {
    type: "GET_SELECTED_PROJECT";
  }
  
  // Background script broadcasting current status
  interface ProjectResponse {
    type: "SELECTED_PROJECT";
    id: string;
    selectionLabel: string;
  }
  
  // Options requesting background script for status change
  interface ProjectSelect {
    type: "SELECT_PROJECT";
    id: string;
    selectionLabel: string;
  }
  
  export type MessageType = ProjectRequest | ProjectResponse | ProjectSelect;