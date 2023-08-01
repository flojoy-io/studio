import { Box, Text, clsx, createStyles, useMantineTheme } from "@mantine/core";
import { IServerStatus } from "@src/context/socket.context";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import {
  cancelFlowChartRun,
  saveAndRunFlowChartInServer,
  saveFlowChartToLocalStorage,
} from "@src/services/FlowChartServices";
import { sendProgramToMix } from "@src/services/MixpanelServices";
import KeyBoardIconSvg from "@src/assets/KeyboardIconSVG";
import LoadIconSvg from "@src/assets/LoadIconSVG";
import SaveIconSvg from "@src/assets/SaveIconSVG";
import { IconCaretDown } from "@tabler/icons-react";
import localforage from "localforage";
import { memo, useEffect, useState, useCallback } from "react";
import "react-tabs/style/react-tabs.css";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import { useFilePicker } from "use-file-picker";
import PlayBtn from "../components/PlayBtn";
import CancelBtn from "../components/CancelBtn";
import { ElementsData } from "flojoy/types";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { SettingsModal } from "./SettingsModal";
import { useSettings } from "@src/hooks/useSettings";
import EnvVarModal from "./EnvVarModal";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import Dropdown from "@src/feature/common/Dropdown";
import { useControlsState } from "@src/hooks/useControlsState";
import { NodeResult } from "@src/feature/common/types/ResultsType";
import SaveFlowChartBtn from "./SaveFlowChartBtn";
import { Settings } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { DarkModeToggle } from "@src/feature/common/DarkModeToggle";
import { API_URI } from "@src/data/constants";

const useStyles = createStyles((theme) => {
  return {
    controls: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      gap: "8px",
    },

    button: {
      padding: "5px",
      cursor: "pointer",
      borderRadius: 2,
      fontSize: "14px",
      textDecoration: "none",
      background: "transparent",
      color: theme.colors.title[0],
      border: "none",
    },

    addButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    },

    addButtonPlus: {
      fontSize: "20px",
      color: theme.colors.accent1[0],
    },

    cancelButton: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "5px",
      height: "33px",
      width: "85px",
      cursor: "pointer",
      color: theme.colors.red[7],
      border: `1px solid ${theme.colors.red[3]}`,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2],
      transition: "transform ease-in 0.1s",

      "&:hover": {
        backgroundColor: theme.colors.red[8],
        color: theme.white,
      },

      "&:hover > svg > g": {
        fill: theme.white,
      },

      "&:active": {
        transform: "scale(0.8)",
      },
    },

    fileButton: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    editContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      paddingRight: "4px",
    },
    dropDownIcon: {
      borderRadius: 20,
    },
    settingsButton: {
      padding: 6,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      "&:hover": {
        backgroundColor: theme.colors.accent1[0] + "2f",
      },
    },
  };
});

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// The following buttons are extracted into components in order to isolate the
// rerenders due to calling useFlowChartGraph.

type SaveButtonProps = {
  saveFile: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
};

const SaveButton = ({ saveFile }: SaveButtonProps) => {
  const { nodes, edges } = useFlowChartGraph();
  useKeyboardShortcut("ctrl", "s", () => saveFile(nodes, edges));
  useKeyboardShortcut("meta", "s", () => saveFile(nodes, edges));

  return (
    <button
      data-cy="btn-save"
      onClick={() => saveFile(nodes, edges)}
      style={{ display: "flex", gap: 10.3 }}
    >
      <SaveIconSvg />
      Save
    </button>
  );
};

type SaveAsButtonProps = {
  saveAsDisabled: boolean;
  saveFile: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
} & SaveButtonProps;

const SaveAsButton = ({ saveAsDisabled, saveFile }: SaveAsButtonProps) => {
  const { nodes, edges } = useFlowChartGraph();

  return (
    <button
      data-cy="btn-saveas"
      style={{
        display: "flex",
        gap: 10.9,
      }}
      className={saveAsDisabled ? "disabled" : ""}
      disabled={saveAsDisabled}
      aria-label="Save As"
      title={
        saveAsDisabled ? "Save As is not supported in this browser, sorry!" : ""
      }
      onClick={() => saveFile(nodes, edges)}
    >
      <SaveIconSvg />
      <Text>Save As</Text>
      <div style={{ position: "absolute", marginLeft: 110, marginTop: 1 }}>
        <small>Ctrl + s</small>
      </div>
    </button>
  );
};

const LoadButton = () => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();

  const [openFileSelector, { filesContent }] = useFilePicker({
    readAs: "Text",
    accept: ".txt",
    maxFileSize: 50,
  });

  // TODO: Find out why this keeps firing when moving nodes
  useEffect(() => {
    // there will be only single file in the filesContent, for each will loop only once
    filesContent.forEach((file) => {
      const parsedFileContent = JSON.parse(file.content);
      const flow = parsedFileContent.rfInstance;
      setCtrlsManifest(parsedFileContent.ctrlsManifest || ctrlsManifest);
      loadFlowExportObject(flow);
    });
  }, [filesContent, loadFlowExportObject, setCtrlsManifest]);

  return (
    <button
      onClick={openFileSelector}
      id="load-app-btn"
      style={{ display: "flex", gap: 11.77 }}
    >
      <LoadIconSvg />
      Load
    </button>
  );
};

type ExportResultButtonProps = {
  results: NodeResult[];
  disabled: boolean;
};

const ExportResultButton = ({ results, disabled }: ExportResultButtonProps) => {
  const downloadResult = async () => {
    if (!results.length) return;
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: "text/plain;charset=utf-8" });
    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName: "output.txt",
        types: [
          {
            description: "Text file",
            accept: { "text/plain": [".txt"] },
          },
        ],
      });
      const writableStream = await handle.createWritable();

      await writableStream.write(blob);
      await writableStream.close();
    } else {
      downloadBlob(blob, "output.txt");
    }
  };

  return (
    <button
      onClick={downloadResult}
      className={disabled ? "disabled" : ""}
      disabled={disabled}
      style={{ display: "flex", gap: 11 }}
    >
      <SaveIconSvg />
      Export Result
    </button>
  );
};

const ControlBar = () => {
  const { states } = useSocket();
  const { socketId, programResults, setProgramResults, serverStatus } = states;
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] =
    useState<boolean>(false);
  const [isEnvVarModalOpen, setIsEnvVarModalOpen] = useState<boolean>(false);
  const { classes } = useStyles();
  const { settingsList } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { rfInstance, setRfInstance, setNodeParamChanged, setCredentials } =
    useFlowChartState();
  const { ctrlsManifest } = useControlsState();

  const createFileBlob = (
    rf: ReactFlowJsonObject<ElementsData>,
    nodes: Node<ElementsData>[],
    edges: Edge[]
  ) => {
    const updatedRf = {
      ...rf,
      nodes,
      edges,
    };

    setRfInstance(updatedRf);

    const fileContent = {
      rfInstance: updatedRf,
      ctrlsManifest,
    };

    const fileContentJsonString = JSON.stringify(fileContent, undefined, 4);

    return new Blob([fileContentJsonString], {
      type: "text/plain;charset=utf-8",
    });
  };

  const saveFile = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (rfInstance) {
      const blob = createFileBlob(rfInstance, nodes, edges);
      downloadBlob(blob, "flojoy.txt");
      sendProgramToMix(rfInstance.nodes);
    }
  };

  const saveFileAs = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (globalThis.IS_ELECTRON) {
      saveFile(nodes, edges);
      return;
    }

    if (rfInstance) {
      const blob = createFileBlob(rfInstance, nodes, edges);

      const handle = await window.showSaveFilePicker({
        suggestedName: "flojoy.txt",
        types: [
          {
            description: "Text file",
            accept: { "text/plain": [".txt"] },
          },
        ],
      });
      const writableStream = await handle.createWritable();

      await writableStream
        .write(blob)
        .then(() => sendProgramToMix(rfInstance.nodes));
      await writableStream.close();
    }
  };

  const onRun = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (rfInstance && rfInstance.nodes.length > 0) {
      // Only update the react flow instance when required.
      const updatedRfInstance = {
        ...rfInstance,
        nodes,
        edges,
      };
      setRfInstance(updatedRfInstance);

      saveFlowChartToLocalStorage(updatedRfInstance);
      sendProgramToMix(rfInstance.nodes, true, false);
      setProgramResults([]);
      saveAndRunFlowChartInServer({
        rfInstance: updatedRfInstance,
        jobId: socketId,
        settings: settingsList.filter((setting) => setting.group === "backend"),
      });
      setNodeParamChanged(undefined);
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first."
      );
    }
  };

  const cancelFC = () => {
    if (rfInstance && rfInstance.nodes.length > 0) {
      cancelFlowChartRun(rfInstance, socketId);
    } else {
      alert("There is no running job on server.");
    }
  };

  const fetchCredentials = () => {
    fetch(`${API_URI}/env/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setCredentials(data.env_var))
      .catch((err) => console.log(err));
  };

  const playBtnDisabled =
    serverStatus === IServerStatus.CONNECTING ||
    serverStatus === IServerStatus.OFFLINE;

  const saveAsDisabled = !("showSaveFilePicker" in window);
  const exportResultDisabled = programResults.length == 0;

  const handleKeyboardShortcutModalClose = useCallback(() => {
    setIsKeyboardShortcutOpen(false);
  }, [setIsKeyboardShortcutOpen]);

  const handleEnvVarModalClose = useCallback(() => {
    setIsEnvVarModalOpen(false);
  }, [setIsEnvVarModalOpen]);

  const handleEnvVarModalOpen = () => {
    setIsEnvVarModalOpen(true);
    fetchCredentials();
  };

  return (
    <Box className={classes.controls}>
      {playBtnDisabled || serverStatus === IServerStatus.STANDBY ? (
        <PlayBtn onPlay={onRun} />
      ) : (
        <CancelBtn cancelFC={cancelFC} />
      )}

      <Dropdown dropdownBtn={<FileButton />}>
        <EnvVarModal
          handleEnvVarModalOpen={handleEnvVarModalOpen}
          fetchCredentials={fetchCredentials}
        />

        <LoadButton />
        <SaveButton saveFile={saveFile} />
        <SaveAsButton saveFile={saveFileAs} saveAsDisabled={saveAsDisabled} />
        <ExportResultButton
          results={programResults}
          disabled={exportResultDisabled}
        />
        <SaveFlowChartBtn />
        <button
          data-testid="btn-keyboardshortcut"
          onClick={() => setIsKeyboardShortcutOpen(true)}
          style={{ display: "flex", gap: 10.11 }}
        >
          <KeyBoardIconSvg />
          Keyboard Shortcut
        </button>
      </Dropdown>

      <Button
        data-testid="btn-setting"
        onClick={() => setIsSettingsOpen(true)}
        size="icon"
        variant="ghost"
      >
        <Settings className="stroke-accent1" />
      </Button>
      <DarkModeToggle />
      <KeyboardShortcutModal
        isOpen={isKeyboardShortcutOpen}
        onClose={handleKeyboardShortcutModalClose}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      {/* <APIKeyModal
        isOpen={isAPIKeyModelOpen}
        onClose={handleAPIKeyModalClose}
        fetchCredentials={fetchCredentials}
      /> */}
    </Box>
  );
};

export default memo(ControlBar);

const FileButton = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  return (
    <button
      data-testid="file-btn"
      id="file-btn"
      className={clsx(classes.button, classes.fileButton)}
    >
      <Text>File</Text>
      <IconCaretDown
        size={14}
        fill={theme.colorScheme === "dark" ? theme.white : theme.black}
      />
    </button>
  );
};
