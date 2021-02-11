import { LRUCache } from "typescript-lru-cache";
import { ConvertImageUrlRequest, GetLabelsRequest, GetPredictionRequest, MessageType, PostPredictionRequest, ProjectSelect } from "../types";

interface Project {
  id: string;
  selectionLabel: string;
}

interface DataStream {
  category: string;
  classes: string[];
  lobeId: string;
}

interface Example {
  exampleId: string;
}

const urlToBase64: Record<string, string> = {};
const predictionCache = new LRUCache<string, Promise<string>>({
  entryExpirationTimeInMS: 1000 * 60,
  maxSize: 500,
});

// TODO - Would be nice to keep track of whether images have been
// already added to a project.
// const base64ToProjectsContaining: Record<
//   string,
//   { projects: Array<string> }
// > = {};

// Sends project selection message to listeners.
const sendSelectedProject = (project: {
  id: string;
  selectionLabel: string;
}) => {
  chrome.runtime.sendMessage({ type: "SELECTED_PROJECT", ...project });
};

// Get locally stored value
function InitializeProjects(callback?: (projects: Project[]) => void) {
  chrome.storage.local.get("selectedProject", (res) => {
    GetProjects().then((data) => {
      projects = data.data.projects.map((project) => {
        return { id: project.id, selectionLabel: project.meta.name };
      });

      // update persisted projects
      chrome.storage.local.set({
        projects: projects,
      });

      // If previous selected project doesn't exist, select the first by default
      if (res["selectedProject"] === undefined) {
        selectedProject = projects[0];
        console.log(
          `Setting default selection: ${JSON.stringify(selectedProject)}`
        );
      }

      // Ensure the project is loaded
      LoadProject(selectedProject.id).then((data) => {
        predictionCache.clear();
        chrome.storage.local.set({
          selectedProject: {
            id: selectedProject.id,
            selectionLabel: selectedProject.selectionLabel,
          },
        });
      });

      callback && callback(projects);
    });
  });
}

// Execute local graphql mutation for LoadProject
function LoadProject(projectId: string) {
  let formData = new FormData();
  formData.append("query", "{projects}");

  var graphqlURL = `http://localhost:38101/graphql`;
  ("mutation LoadProject($projectId:ID!){loadProject(projectId:$projectId)}");
  return fetch(graphqlURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      variables: JSON.stringify({ projectId: projectId }),
      query: `
mutation LoadProject($projectId:ID!) {
  loadProject(projectId:$projectId)
}`,
    }),
  }).then((response) => response.json());
}

// Execute local graphql query for projects
function GetProjects() {
  let formData = new FormData();
  formData.append("query", "{projects}");

  var graphqlURL = `http://localhost:38101/graphql`;

  return fetch(graphqlURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
    query {
      projects {
        id
        meta {
          name
          description
          category
          userSaved
          displayInBrowse
          type
          templateId
          optimization
        }
      }
    }`,
    }),
  }).then((response) => response.json()); // TODO interface
}

// GET the datastreams for a project via Rest API
function GetDatastream(projectId: string) {
  var dataStreamsUrl = `http://localhost:38101/data/v1/project/${projectId}/datastream`;

  return fetch(dataStreamsUrl)
    .then((response) => response.json())
    .then((data) => {
      return data as DataStream[];
    });
}

// POST image to image datastream
function PostItemImage(
  projectId: string,
  imageDataStream: string,
  base64Image: string
) {
  var dataStreamUrl = `http://localhost:38101/data/v1/project/${projectId}/datastream/`;
  var inputUrl = dataStreamUrl + imageDataStream + "/item";

  return fetch(base64Image)
    .then((res) => res.blob())
    .then((blob) => {
      const inputItems = {
        isTest: false,
        item: "",
        type: "image",
        exampleId: "",
        timestamp: Date.now(),
      };
      let formData = new FormData();
      formData.append("items[]", JSON.stringify(inputItems));
      formData.append("file", blob, "image.png");

      return fetch(inputUrl, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((exampleJson) => {
          return exampleJson as Example[];
        })
        .catch((error) => alert(`error caught: ${error}`));
    });
}

// POST label to label datastream
function PostItemLabel(
  projectId: string,
  labelDataStream: string,
  exampleId: string,
  label: string
) {
  var dataStreamUrl = `http://localhost:38101/data/v1/project/${projectId}/datastream/`;
  var inputUrl = dataStreamUrl + labelDataStream + "/item";

  const targetItems = {
    isTest: false,
    item: label,
    type: "text",
    exampleId: exampleId,
    timestamp: Date.now(),
  };
  let targetFormData = new FormData();
  targetFormData.append("items[]", JSON.stringify(targetItems));

  return fetch(inputUrl, {
    method: "POST",
    body: targetFormData,
  })
    .then((response) => response.json())
    .then((exampleJson) => {
      return exampleJson as Example[];
    });
}


function GetPrediction(message: GetPredictionRequest, sendResponse: (response?: any) => void) {
  const projectId: string = message.projectId;
  const base64Image: string = message.base64Image;

  const knownPrediction = predictionCache.peek(base64Image);

  if (knownPrediction) {
    // Already queued prediction request, await it.
    predictionCache.set(
      base64Image,
      knownPrediction.then((data) => {
        // return the result
        sendResponse({ data: data });
        return data;
      })
    );
  } else {
    // Queue prediction request
    predictionCache.set(
      base64Image,
      new Promise<string>(function (resolve, reject) {
        console.log(`Fetching prediction`);
        var data = JSON.stringify({
          inputs: {
            Image: base64Image?.split("base64,")[1],
          },
        });

        var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            resolve(this.responseText);
          }
        });

        xhr.open("POST", `http://localhost:38100/predict/${projectId}`);

        xhr.send(data);
      }).then((data) => {
        // Preidiction request complete
        sendResponse({ data });
        return data;
      })
    );
  }
}

function PostPrediction(message: PostPredictionRequest, sendResponse: (response?: any) => void) {
  const projectId: string = message.projectId;
  const base64Image: string = message.base64Image;
  const label: string = message.label;

  GetDatastream(projectId)
    .then((dataStreams) => {
      let targets: string;
      let inputs: string;
      for (let dx = 0; dx < dataStreams.length; dx++) {
        let dataStream = dataStreams[dx];
        if (dataStream.category === "input") {
          inputs = dataStream.lobeId;
        } // if (dataStream.category === "target")
        else {
          targets = dataStream.lobeId;
        }
      }

      return [targets, inputs];
    })
    .then((value) => {
      const [targets, inputs] = value;
      return PostItemImage(projectId, inputs, base64Image).then(
        (example) => {
          console.log(`Got Example: ${JSON.stringify(example)}`);
          return PostItemLabel(
            projectId,
            targets,
            example[0].exampleId,
            label
          );
        }
      );
    })
    .then((example) => {
      sendResponse({ data: example });
    });
}

function GetProjectLabels(message: GetLabelsRequest, sendResponse: (response?: any) => void) {
  console.info(`get_labels`);
  const projectId: string = message.projectId;

  GetDatastream(projectId)
    .then((dataStreams) => {
      let targets: string[];
      console.info(
        `get_labels Got DataStream ; ${JSON.stringify(dataStreams)}`
      );
      for (let dx = 0; dx < dataStreams.length; dx++) {
        let dataStream = dataStreams[dx];
        if (dataStream.category === "target") {
          targets = dataStream.classes;
        }
      }
      console.info(`get_labels Got targets ; ${JSON.stringify(targets)}`);

      sendResponse({ data: targets });
    })
    .catch((err) => {
      console.error(`error: ${JSON.stringify(err)}`);
    });
}

function ConvertImageToData(message: ConvertImageUrlRequest, sendResponse: (response?: any) => void) {
  if (urlToBase64[message.url]) {
    console.log(`cache image data!`);
    sendResponse({ data: urlToBase64[message.url] });
  } else {
    console.log(`populating cache image data!`);
    var canvas = document.createElement("canvas");
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.addEventListener("load", function () {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      const data = canvas.toDataURL("image/jpeg");
      urlToBase64[message.url] = data;
      sendResponse({ data });
    });
    img.src = message.url;
  }
}

function SelectProject(message: ProjectSelect) {
  console.log(
    `setting project: ${JSON.stringify(
      selectedProject.id
    )} to ${JSON.stringify(message.id)} with ${JSON.stringify(
      message.selectionLabel
    )}`
  );
  if (selectedProject.id !== message.id) {
    LoadProject(message.id).then((data) => {
      predictionCache.clear();
      selectedProject.id = message.id;
      selectedProject.selectionLabel = message.selectionLabel;
      chrome.storage.local.set({
        selectedProject: {
          id: message.id,
          selectionLabel: message.selectionLabel,
        },
      });
    });
  }
}

let selectedProject: Project = undefined;
let projects: Project[] = undefined;

chrome.storage.local.clear();
InitializeProjects();

// Listen to tab changes and inject browser content script.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.includes("http")) {
    chrome.tabs.executeScript(
      tabId,
      { file: "./injectscript.js" },
      function () {
        chrome.tabs.executeScript(
          tabId,
          { file: "./content.bundle.js" },
          function () {
            console.log("Lobe Content Script Injected");
          }
        );
      }
    );
  }
});

chrome.runtime.onMessage.addListener(
  (
    message: MessageType,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    switch (message.type) {
      case "GET_SELECTED_PROJECT": {
        console.log(`project requested: ${JSON.stringify(selectedProject)}`);
        sendSelectedProject(selectedProject);
        break;
      }
      case "SELECT_PROJECT": {
        SelectProject(message);
        break;
      }
      case "CONVERT_IMAGE_URL_TO_DATA_URL":
        ConvertImageToData(message, sendResponse);
        break;
      case "GET_PROJECTS":
        InitializeProjects((data) => {
          sendResponse({ data });
        });
        break;
      case "GET_SOME_LABELS": {
        GetProjectLabels(message, sendResponse);
        break;
      }
      case "POST_PREDICTION": {
        PostPrediction(message, sendResponse);
        break;
      }
      case "GET_PREDICTION": {
        GetPrediction(message, sendResponse);
        break;
      }
      default:
        break;
    }
    return true; // Required for async sendResponse()
  }
);

