import _ from "lodash";
import {
  default as React,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { animated, useSpring } from "react-spring";
import VisibilitySensor from "react-visibility-sensor";
import "../../styles/Popup.scss";
import { MessageType } from "../../types";
import { LobeLogo } from "../lobe/logo/LobeLogo";
import {
  TryoutLabelingState
} from "../lobe/tryoutView/tryoutCommonTypes";
import {
  TryoutPredictionControls
} from "../lobe/tryoutView/tryoutPredictionControls";
import { useProjectLabels } from "../lobe/utils/hooks";

const HamburgerMenu = () => {
  return (
    <svg width="32" height="32">
      <g fill="none">
        <path d="M0 0h32v32H0z" />
        <path
          d="M8 10h16v1H8zm0 5.5h16v1H8zM8 21h16v1H8z"
          fill="#5C5C5C"
          opacity=".7"
        />
      </g>
    </svg>
  );
};

function Popup() {
  const onClick = useCallback(() => {
    chrome.tabs.create({ url: "options.html" });
  }, []);

  const [projectId, setProjectId] = useState<string>(undefined);
  const [projectName, setProjectName] = useState<string>(undefined);


  const labels = useProjectLabels(projectId);

  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    selectionLabel: string;
  }>(undefined);
  useEffect(() => {
    console.log(`requesting selected project from backend`);
    chrome.runtime.sendMessage({ type: "GET_SELECTED_PROJECT" });

    chrome.runtime.onMessage.addListener((message: MessageType) => {
      switch (message.type) {
        case "SELECTED_PROJECT":
          console.log(`got project from backend: ${JSON.stringify(message)}`);
          setSelectedProject({
            id: message.id,
            selectionLabel: message.selectionLabel,
          });
          break;
        default:
          break;
      }
    });
  }, [setSelectedProject]);
  useEffect(() => {
    if (selectedProject) {
      console.log(`project set: ${JSON.stringify(selectedProject)}`);
      setProjectId(selectedProject.id);
      setProjectName(selectedProject.selectionLabel);
    }
  }, [selectedProject, setProjectId]);

  return (
    <div className="App">
      <header className="App-header">
        <a onClick={onClick} className="options-menu-button" href="Options">
          <HamburgerMenu />
        </a>
        <LobeLogo />
        <h1>API Predictions</h1>
      </header>
      <div className="App-body">
        <div>Project: {projectName || "Please open Lobe."}</div>
        {projectId && <ImageList projectId={projectId} labels={labels}/>}
      </div>
    </div>
  );
}

// Script code to inject on page
// Selects images then returns array of their currentSrc
const scriptCode = `(function() {
    let images = document.querySelectorAll('img');
    let srcArray =
         Array.from(images).filter(function(image) {return image && image.width > 50;}).map(function(image) {
           
           return image.currentSrc;
         });
    return srcArray
  })();`;

const scrapeImages = (callback: (data: any) => void) => {
  chrome.tabs.executeScript({ code: scriptCode }, function (result) {
    callback(result[0]);
  });
};

interface ImageListProps {
  projectId: string;
  labels: string[];
}

interface ImagePredictionProps extends ImageListProps {
  imageSrc: string;
}

function FetchPredictionForImage(
  projectId: string,
  imageSrc: string,
  callback: (prediction: string, accuracy: number) => void
) {
  local_url_to_data_url(imageSrc, function (data) {
    getPrediction(projectId, data, function (data) {
      const { outputs } = JSON.parse(data);
      let percentage = 0;
      for (var idx in outputs.Labels) {
        if (outputs.Labels[idx][0] === outputs.Prediction[0]) {
          percentage = outputs.Labels[idx][1] * 100;
        }
      }
      callback(outputs.Prediction, percentage);
    });
  });
}

function local_url_to_data_url(url: any, success: (data: any) => void) {
  chrome.runtime.sendMessage(
    { message: "convert_image_url_to_data_url", url: url },
    function (response) {
      success(response && response.data);
    }
  );
}

// val params = JSONObject()
// val variables = JSONObject()
// variables.put("projectId", projectId)
// params.put(
//     "query",
//     "mutation LoadProject(\$projectId:ID!){loadProject(projectId:\$projectId)}"
// )
// params.put("variables", variables)

// function addImageWithLabel(blobData: any, ) {
//   var dataStreamsUrl = `http://localhost:38101/data/v1/project/${projectId}/datastream`;
//   fetch(dataStreamsUrl)
//     .then((response) => response.text())
//     .then((data) => {
//       let targets = "";
//       let inputs = "";

//       const dataStreams = JSON.parse(data);
//       // alert(`Clicked!: ${dataStreams[0]}`);
//       for (let dx = 0; dx < dataStreams.length; dx++) {
//         let dataStream = dataStreams[dx];
//         if (dataStream.category === "input") {
//           inputs = dataStream.lobeId;
//         } // if (dataStream.category === "target")
//         else {
//           targets = dataStream.lobeId;
//         }
//       }

//       var dataStreamUrl = `http://localhost:38101/data/v1/project/${projectId}/datastream/`;
//       var inputUrl = dataStreamUrl + inputs + "/item";

//       // """{"isTest":false, "item":"", "type": "image","exampleId":"", "timestamp":${Instant.now()
//       //   .toEpochMilli()}}"""

//       fetch(blobData)
//         .then((res) => res.blob())
//         .then((blob) => {
//           const inputItems = {
//             isTest: false,
//             item: "",
//             type: "image",
//             exampleId: "",
//             timestamp: Date.now(),
//           };
//           let formData = new FormData();
//           formData.append("items[]", JSON.stringify(inputItems));
//           formData.append("file", blob, "image.png");

//           // fetch(inputUrl, {method: 'POST'})
//           fetch(inputUrl, {
//             method: "POST",
//             body: formData,
//           })
//             .then((response) => response.text())
//             .then((imageResponseText) => {
//               // var example = JSON.parse(imageResponseText)[0];

//               // var targetUrl = dataStreamUrl + targets + "/item";

//               // const prediction = document.getElementById(predictionId);
//               // const targetItems = {
//               //   isTest: false,
//               //   item: prediction.textContent,
//               //   type: "text",
//               //   exampleId: example.exampleId,
//               //   timestamp: Date.now(),
//               // };
//               // let targetFormData = new FormData();
//               // targetFormData.append("items[]", JSON.stringify(targetItems));

//               // fetch(targetUrl, {
//               //   method: "POST",
//               //   body: targetFormData,
//               // })
//               //   .then((response) => response.text())
//               //   .then((imageResponseText) => {
//                   // alert(`Image added!`);
//                 // })
//                 // .catch((error) => alert(`error caught: ${error}`));
//             })
//             .catch((error) => alert(`error caught: ${error}`));
//         });
//     })
//     .catch((error) => alert(`error caught: ${error}`));

//   // alert(`Clicked!: ${data}`);
//   // post to dataset
// }

function postImage(projectId: string, base64Image: string, label: string, success: (result: any) => void)
{
  if (projectId === undefined) {
    alert("postImage ERROR: projectId undefined");
  }

  chrome.runtime.sendMessage(
    {
      message: "post_prediction",
      projectId: projectId,
      base64Image: base64Image,
      label: label,
    },
    function (response) {
      success(response && response.data);
    }
  );
}

function getPrediction(
  projectId: string,
  base64Image: any,
  success: (data: any) => void
) {
  if (projectId === undefined) {
    alert("getPrediction ERROR: projectId undefined");
  }
  chrome.runtime.sendMessage(
    {
      message: "get_prediction",
      projectId: projectId,
      base64Image: base64Image,
    },
    function (response) {
      success(response && response.data);
    }
  );
}

// function loop100(action: (num: number) => void, start: number = 0, delay: number = 1000)
// {
//   setTimeout(() => {action(start); loop100(action, (start + 10) % 110);}, delay);
// }

const ImagePrediction: React.FunctionComponent<ImagePredictionProps> = (
  props: ImagePredictionProps
) => {
  const { imageSrc, projectId } = props;

  const [prediction, setPrediction] = useState<string>("Loading...");
  const [accuracy, setAccuracy] = useState<number>(0);
  const [visibileAccuracy, setVisibleAccuracy] = useState<number>(0);
  const [visibility, setVisibility] = useState<boolean>(false);

  useEffect(() => {
    if (projectId) {
      FetchPredictionForImage(
        projectId,
        imageSrc,
        (prediction: string, accuracy: number) => {
          // console.log(`fetch callback: ${prediction} - ${accuracy}%`);
          setPrediction(prediction);
          setAccuracy(accuracy);
        }
      );
    }
  }, [imageSrc, setPrediction, projectId]);

  useEffect(() => {
    if (visibility) {
      setVisibleAccuracy(accuracy);
    } else {
      // If you want the animation to re-play when scrolled back into view, uncomment.
      // setVisibleAccuracy(0);
    }
  }, [visibility, setVisibleAccuracy, accuracy]);

  const foregroundAnimation = useSpring({
    opacity: 1,
    config: {
      tension: 125,
      friction: 22,
    },
    delay: 10,
    width: `${Math.max(0, 2 * visibileAccuracy - 100)}%`,
  });

  const onVisibilityChanged = useCallback(
    (isVisible: boolean) => {
      setVisibility(isVisible);
    },
    [setVisibility]
  );

  return (
    <div className="label-pill-prediction">
      <VisibilitySensor onChange={onVisibilityChanged} partialVisibility={true}>
        <div className="label-pill-container label-pill-container-v2 label-pill-container--label label-pill--as-prediction">
          <animated.div
            className="label-pill-foreground"
            style={{ ...foregroundAnimation }}
          />
          <div className="typeahead-input">{prediction}</div>
        </div>
      </VisibilitySensor>
    </div>
  );
};

interface TryoutWrapperProps {
  projectId: string;
  imageData: string;
  labels: string[];
}

const TryoutWrapper: React.FunctionComponent<TryoutWrapperProps> = (
  props: TryoutWrapperProps
) => {
  const { projectId, imageData, labels } = props;
  const [labelingState, setLabelingState] = useState<TryoutLabelingState>(
    TryoutLabelingState.None
  );


  const onSubmit = useCallback(
    (label: string) => {
      if (
        labelingState === TryoutLabelingState.None ||
        labelingState === TryoutLabelingState.Labeling
      ) {

        // After this, UI will marked this as labeled.

        // P0 -- Add to Lobe
        // P2 -- Mark as added for future opening of the UI -- P2

        local_url_to_data_url(imageData, function (data) {
          console.log(`onSubmit - ${imageData} - ${label}`);
          postImage(projectId, data, label, function (result) {
            console.log(`Image posted.`);
            console.log(result);
          });
        });
      }

      // TODO This
      // if (label.length) {
      //   const upload: TryoutImageUpload = {
      //     label,
      //     dataUrl: image, // TODO base64
      //     source: TryoutUploadSource.Image,
      //   };
      //   // onSubmitProp(upload);
      // }
    },
    [imageData, labelingState, projectId]
  );

  

  return (
    <div>
      <TryoutPredictionControls
        imageData={imageData}
        projectId={projectId}
        labels={labels}
        onSubmit={onSubmit}
        pauseAfterAdd={true}
        tab="Images"
        setLabelingState={setLabelingState}
        labelingState={labelingState}
      />
    </div>
  );
};

// const ImagePrediction: React.FunctionComponent<ImagePredictionProps> = (
//   props: ImagePredictionProps
// ) => {
const ImageList: React.FunctionComponent<ImageListProps> = (
  props: ImageListProps
) => {
  const { projectId, labels } = props;
  const [imageResult, setImageResult] = useState<any>(undefined);

  useEffect(() => {
    scrapeImages((data: any) => {
      setImageResult(data);
    });
  }, [setImageResult]);

  // render the image components
  const imageComponents = useMemo(
    () =>
      _.values(imageResult).map((image, idx) => {
        return (
          <div className="example-item" key={`example-item-${idx}`}>
            <div className="example-square">
              {/* <div className="example-image"> */}
              <img id={`image-id-${idx}`} alt="" src={image} />
              {/* </div> */}
            </div>

            {/* TODO -- import tryoutPredictionControls with PlayTypeahead */}
            <TryoutWrapper imageData={image} projectId={projectId} labels={labels}/>

            {/* <div className="tryout-prediction-controls-container-images tryout-prediction-controls-container">
            <ImagePrediction imageSrc={image} projectId={projectId} />
            <TryoutControls imageSrc={image} />
          </div> */}
          </div>
        );
      }),
    [imageResult, projectId]
  );

  return <div className="image-list">{imageComponents}</div>;
};

export default Popup;