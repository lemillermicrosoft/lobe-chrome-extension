
export interface APIResponse {
    outputs: {
      Labels: (string | number)[];
      Prediction: (string | number)[];
    };
  };