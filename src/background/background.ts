import { LRUCache } from "typescript-lru-cache";
import { MessageType } from "../types";

interface Project {
  id: string;
  selectionLabel: string;
}

let selectedProject: Project = undefined;
let projects: Project[] = undefined;
// chrome.storage.local.set({ selectedProject: selectedProject });
chrome.storage.local.clear();

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
      chrome.storage.local.set({
        projects: projects,
      });

      console.log(`durp: ${JSON.stringify(res)}`);
      if (res["selectedProject"] === undefined) {
        selectedProject = projects[0];

        LoadProject(selectedProject.id).then((data) => {
          // alert(`project loaded: ${JSON.stringify(data)}`);
          predictionCache.clear();
          chrome.storage.local.set({
            selectedProject: {
              id: selectedProject.id,
              selectionLabel: selectedProject.selectionLabel,
            },
          });
        });

        console.log(
          `Setting default selection: ${JSON.stringify(selectedProject)}`
        );
      }

      callback && callback(projects);
    });
  });
}
InitializeProjects();

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
            console.log("INJECTED AND EXECUTED");
          }
        );
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "GET_SELECTED_PROJECT":
      console.log(`project requested: ${JSON.stringify(selectedProject)}`);
      sendSelectedProject(selectedProject);
      break;
    case "SELECT_PROJECT":
      console.log(
        `setting project: ${JSON.stringify(
          selectedProject.id
        )} to ${JSON.stringify(message.id)} with ${JSON.stringify(
          message.selectionLabel
        )}`
      );
      if (selectedProject.id !== message.id) {
        // TODO Load Project -- if this fails? don't change selection? Alert?
        LoadProject(message.id).then((data) => {
          // alert(`project loaded: ${JSON.stringify(data)}`);
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
      break;
    default:
      break;
  }
});

const urlToBase64: Record<string, string> = {};

// const base64ToProjectsContaining: Record<
//   string,
//   { projects: Array<string> }
// > = {};

const predictionCache = new LRUCache<string, Promise<string>>({
  entryExpirationTimeInMS: 1000 * 60,
  maxSize: 500,
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "convert_image_url_to_data_url") {
    if (urlToBase64[request.url]) {
      console.log(`cache image data!`);
      sendResponse({ data: urlToBase64[request.url] });
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
        urlToBase64[request.url] = data;
        sendResponse({ data });
      });
      img.src = request.url;
    }

    return true; // Required for async sendResponse()
  } else if (request.message == "get_projects") {
    InitializeProjects((data) => {
      sendResponse({ data });
    });

    return true;
  } else if (request.message == "get_some_labels") {
    console.info(`get_labels`);
    // TODO interfaces for these messages
    const projectId: string = request.projectId;

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

    return true;
  } else if (request.message == "post_prediction") {
    // TODO interfaces for these messages
    const projectId: string = request.projectId;
    const base64Image: string = request.base64Image;
    const label: string = request.label;

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
        return PostItemImage(projectId, inputs, base64Image).then((example) => {
          console.log(`Got Example: ${JSON.stringify(example)}`);
          return PostItemLabel(projectId, targets, example[0].exampleId, label);
        });
      })
      .then((example) => {
        // alert(`Sending Response: ${JSON.stringify(example)}`);
        sendResponse({ data: example });
      });
    return true;
  } else if (request.message == "get_prediction") {
    const projectId: string = request.projectId;
    const base64Image: string = request.base64Image;

    const knownPrediction = predictionCache.peek(base64Image);

    if (knownPrediction) {
      // console.log(`Awaiting prediction cache`);
      // console.log(`Awaiting prediction cache ${hashCode(base64Image)}`);
      predictionCache.set(
        base64Image,
        knownPrediction.then((data) => {
          // console.log(`Cache promise complete! ${hashCode(base64Image)}`);
          // console.log(`sendResponse({ data: data }); ${hashCode(base64Image)}`);
          // console.log(`${data} ${hashCode(base64Image)}`);
          sendResponse({ data: data });
          return data;
        })
      );
    } else {
      predictionCache.set(
        base64Image,
        new Promise<string>(function (resolve, reject) {
          console.log(`Fetching prediction`);
          // console.log(`Fetching prediction ${hashCode(base64Image)}`);
          var data = JSON.stringify({
            inputs: {
              Image: base64Image?.split("base64,")[1], // todo a bug lives here
            },
          });

          var xhr = new XMLHttpRequest();
          // xhr.withCredentials = true;

          xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
              // alert(`hey: ${this.responseText}`);
              // console.log(`Prediction FOUND ${hashCode(base64Image)}`);
              // console.log(`resolve({ data: this.responseText }); ${hashCode(base64Image)}`);
              // console.log(`${this.responseText} ${hashCode(base64Image)}`);
              resolve(this.responseText);
            }
          });

          xhr.open(
            "POST",
            `http://localhost:38100/predict/${projectId}` //5a866fee-3d04-412e-b5e0-50f5fc586ad2"
          );

          xhr.send(data);
        }).then((data) => {
          // console.log(`Initial promise complete ${hashCode(base64Image)}`);
          // console.log(`sendResponse({ data: data }); ${hashCode(base64Image)}`);
          // console.log(`${JSON.stringify(data)} ${hashCode(base64Image)}`);
          sendResponse({ data });
          return data;
        })
      );
    }

    return true;
  }
});

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

interface DataStream {
  category: string;
  classes: string[];
  lobeId: string;
}

interface Example {
  exampleId: string;
}

function GetDatastream(projectId: string) {
  var dataStreamsUrl = `http://localhost:38101/data/v1/project/${projectId}/datastream`;

  return fetch(dataStreamsUrl)
    .then((response) => response.json())
    .then((data) => {
      return data as DataStream[];
    });
}

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

      // fetch(inputUrl, {method: 'POST'})
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
