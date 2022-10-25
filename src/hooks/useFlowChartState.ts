import { Elements, FlowExportObject } from "react-flow-renderer";
import { CTRLS_MANIFEST, GRID_LAYOUT, NOISY_SINE } from "../data/RECIPES.js";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { saveAs } from "file-saver";
import { useFilePicker } from "use-file-picker";
import { useCallback, useEffect } from "react";
import { Layout } from "react-grid-layout";

export interface CtlManifestType {
  type: string;
  name: string;
  id: string;
  param?: any;
  val?: any;
  hidden?: boolean;
  controlGroup?: string;
  label?: string;
  minHeight: number;
  minWidth: number;
}

export interface RfSpatialInfoType {
  x: number;
  y: number;
  zoom: number;
}

const initialElements: Elements = NOISY_SINE.elements;
const initialManifests: CtlManifestType[] = CTRLS_MANIFEST;
const showLogsAtom = atomWithImmer<boolean>(false);
const uiThemeAtom = atomWithImmer<"light" | "dark">("dark");
const rfInstanceAtom = atomWithImmer<FlowExportObject<any> | undefined>(
  undefined
);
const elementsAtom = atomWithImmer<Elements>(initialElements);
const manifestAtom = atomWithImmer<CtlManifestType[]>(initialManifests);
const rfSpatialInfoAtom = atomWithImmer<RfSpatialInfoType>({
  x: 0,
  y: 0,
  zoom: 1,
});
const editModeAtom = atomWithImmer<boolean>(false);
const gridLayoutAtom = atomWithImmer<Layout[]>(GRID_LAYOUT);
export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [elements, setElements] = useAtom(elementsAtom);
  const [ctrlsManifest, setCtrlsManifest] = useAtom(manifestAtom);
  const [rfSpatialInfo, setRfSpatialInfo] = useAtom(rfSpatialInfoAtom);
  const [isEditMode, setIsEditMode] = useAtom(editModeAtom);
  const [gridLayout, setGridLayout] = useAtom(gridLayoutAtom);
  const [uiTheme, setUiTheme] = useAtom(uiThemeAtom);
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);

  const loadFlowExportObject = useCallback(
    (flow: FlowExportObject) => {
      if (!flow) {
        return;
      }
      setElements(flow.elements || []);
      setRfSpatialInfo({
        x: flow.position[0] || 0,
        y: flow.position[1] || 0,
        zoom: flow.zoom || 0,
      });
    },
    [setElements, setRfSpatialInfo]
  );

  const [openFileSelector, { filesContent }] = useFilePicker({
    readAs: "Text",
    accept: ".txt",
    maxFileSize: 50,
  });

  useEffect(() => {
    // there will be only single file in the filesContent, for each will loop only once
    filesContent.forEach((file) => {
      const parsedFileContent = JSON.parse(file.content);
      setCtrlsManifest(parsedFileContent.ctrlsManifest || initialManifests);
      const flow = parsedFileContent.rfInstance;
      setGridLayout(parsedFileContent.gridLayout);
      loadFlowExportObject(flow);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesContent, loadFlowExportObject]);

  const saveFile = async () => {
    if (rfInstance) {
      const fileContent = {
        rfInstance,
        ctrlsManifest,
        gridLayout,
      };
      const fileContentJsonString = JSON.stringify(fileContent, undefined, 4);

      var blob = new Blob([fileContentJsonString], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "flojoy.txt");
    }
  };

  const updateCtrlInputDataForNode = (
    nodeId: string,
    paramId: string,
    inputData: any
  ) => {
    setElements(element=> {
     const node = element.find((e) => e.id === nodeId);
        if (node) {
      node.data.ctrls[paramId] = inputData;
      if(node.data.func === 'CONSTANT'){
        node.data.label = inputData.value
      }
      // node.data.label = inputData.value
    }
    });
  };
  const removeCtrlInputDataForNode = (nodeId: string, paramId: string) => {
    setElements((elements) => {
      const node = elements.find((e) => e.id === nodeId);
      if (node) {
        node.data.ctrls = node.data.ctrls || {};
        delete node.data.ctrls[paramId];
      }
    });
  };
  useEffect(() => {
    setRfInstance((prev) => {
      if (prev) {
        prev.elements = elements;
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);
  return {
    rfInstance,
    setRfInstance,
    elements,
    setElements,
    rfSpatialInfo,
    updateCtrlInputDataForNode,
    removeCtrlInputDataForNode,
    ctrlsManifest,
    setCtrlsManifest,
    loadFlowExportObject,
    openFileSelector,
    saveFile,
    isEditMode,
    setIsEditMode,
    gridLayout,
    setGridLayout,
    uiTheme,
    setUiTheme,
    showLogs,
    setShowLogs,
  };
}
