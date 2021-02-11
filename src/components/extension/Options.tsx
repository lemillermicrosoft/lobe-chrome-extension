import React, { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import Select from "react-select";
import { MessageType } from "../../types";
import Content from "./Content";
import Popup from "./Popup";

function get_projects(success: (data: any) => void) {
  chrome.runtime.sendMessage({ type: "GET_PROJECTS" }, function (response) {
    success(response && response.data);
  });
}

function Options() {
  const [projects, setProjects] = useState<
    { id: string; selectionLabel: string }[]
  >([]);
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
    get_projects((data: any) => {
      setProjects(
        data.map((d) => ({ id: d.id, selectionLabel: d.selectionLabel }))
      );
    });
  }, [setProjects]);

  useEffect(() => {
    if (selectedProject) {
      console.log(`project set: ${JSON.stringify(selectedProject)}`);
      // chrome.runtime.sendMessage({
      //   type: "SELECT_PROJECT",
      //   ...selectedProject,
      // });
    }
  }, [selectedProject]);

  const onSelectionChanged = useCallback((selection) => {
    // alert(JSON.stringify(selection));
    chrome.runtime.sendMessage({
      type: "SELECT_PROJECT",
      id: selection.value,
      selectionLabel: selection.label,
    });
    setSelectedProject({
      id: selection.value,
      selectionLabel: selection.label,
    });
  }, []);

  return (
    <Router>
      <div>
        <div>
          <h1>Lobe Extension - Options</h1>

          <div>Project: {selectedProject?.id || "Please open Lobe."}</div>
          <div>
            {selectedProject?.id && (
              <Select
                value={{
                  value: selectedProject?.id,
                  label: selectedProject?.selectionLabel,
                }}
                onChange={onSelectionChanged}
                options={projects.map((p) => {
                  return { value: p.id, label: p.selectionLabel };
                })}
              />
            )}
          </div>
        </div>
        <Switch>
          <Route exact path="/popup">
            <Popup />
          </Route>
          <Route exact path="/foreground">
            <Content />
          </Route>
          <Route exact path="/">
            <Redirect to="/options.html" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
export default Options;
