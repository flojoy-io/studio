import { Node, Edge, XYPosition, Connection, addEdge } from "reactflow";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  BlockParameterValue,
  TextData,
  BlockDefinition,
  BlockData,
  positionSchema,
} from "@/renderer/types/node";
import { useShallow } from "zustand/react/shallow";

import * as galleryItems from "@/renderer/data/apps";
import { ExampleProjects } from "@/renderer/data/docs-example-apps";
import * as RECIPES from "@/renderer/data/RECIPES";
import { syncFlowchartWithManifest } from "@/renderer/lib/sync";
import {
  MixPanelEvents,
  sendEventToMix,
} from "@/renderer/services/MixpanelServices";
import { v4 as uuidv4 } from "uuid";
import { addRandomPositionOffset } from "@/renderer/utils/RandomPositionOffset";
import { Project } from "@/renderer/types/project";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { Draft } from "immer";
import { useCallback, useEffect } from "react";
import {
  useManifestStore,
  useManifest,
  useMetadata,
} from "@/renderer/stores/manifest";
import {
  createNodeId,
  createNodeLabel,
  ctrlsFromParams,
} from "@/renderer/utils/NodeUtils";
import { filterMap } from "@/renderer/utils/ArrayUtils";
import { getEdgeTypes, isCompatibleType } from "@/renderer/utils/TypeCheck";
import { toast } from "sonner";
import { useFlowchartStore } from "@/renderer/stores/flowchart";
import {
  Result,
  Ok,
  Err,
  tryCatch,
  tryCatchPromise,
  tryParse,
} from "@/types/result";
import { useSocketStore } from "./socket";
import { useHardwareStore } from "./hardware";
import { DeviceInfo } from "@/renderer/types/hardware";

type State = {
  name: string | undefined;
  path: string | undefined;
  hasUnsavedChanges: boolean;

  nodes: Node<BlockData>[]; // TODO: Turn this into a record for fast lookup
  edges: Edge[];
  textNodes: Node<TextData>[];
};

type Actions = {
  setProjectName: (name: string) => void;

  updateBlockParameter: (
    blockId: string,
    paramName: string,
    value: BlockParameterValue,
  ) => Result<void>;
  updateBlockInitParameter: (
    blockId: string,
    paramName: string,
    value: BlockParameterValue,
  ) => Result<void>;
  updateBlockLabel: (blockId: string, name: string) => Result<void>;

  handleNodeChanges: (
    cb: (nodes: Node<BlockData>[]) => Node<BlockData>[],
  ) => void;
  handleTextNodeChanges: (
    cb: (nodes: Node<TextData>[]) => Node<TextData>[],
  ) => void;
  handleEdgeChanges: (cb: (nodes: Edge[]) => Edge[]) => void;

  addTextNode: (position: XYPosition) => void;
  updateTextNodeText: (id: string, text: string) => Result<void>;
  deleteTextNode: (id: string) => void;

  saveProject: () => Promise<Result<string>>;
};

const defaultProjectData =
  resolveProjectReference(resolveDefaultProjectReference()) ??
  RECIPES.NOISY_SINE;
const initialNodes: Node<BlockData>[] = defaultProjectData.nodes;
const initialEdges: Edge[] = defaultProjectData.edges;

export const useProjectStore = create<State & Actions>()(
  immer((set, get) => ({
    name: undefined,
    setProjectName: (name: string) => {
      set({ name });
    },

    path: undefined,
    hasUnsavedChanges: false,

    nodes: initialNodes,
    edges: initialEdges,
    textNodes: [],

    handleNodeChanges: (
      cb: (nodes: Node<BlockData>[]) => Node<BlockData>[],
    ) => {
      set((state) => {
        state.nodes = cb(state.nodes);
      });
    },
    handleTextNodeChanges: (
      cb: (nodes: Node<TextData>[]) => Node<TextData>[],
    ) => {
      set((state) => {
        state.textNodes = cb(state.textNodes);
      });
    },
    handleEdgeChanges: (cb: (edges: Edge[]) => Edge[]) => {
      set((state) => {
        state.edges = cb(state.edges);
      });
    },

    updateBlockParameter: (
      blockId: string,
      paramName: string,
      value: BlockParameterValue,
    ) => {
      try {
        set((state) => {
          const block = state.nodes.find((e) => e.id === blockId);
          if (!block) {
            throw new Error("Block not found");
          }

          block.data.ctrls[paramName].value = value;
          if (block.data.func === "CONSTANT" && paramName === "constant") {
            block.data.label = value?.toString() ?? "CONSTANT";
          }
        });
      } catch (e) {
        return Err(e as Error);
      }

      sendEventToMix("Control Input Data Updated", {
        blockId,
        paramName,
        value,
      });
      setHasUnsavedChanges(true);

      return Ok(undefined);
    },

    updateBlockInitParameter: (
      blockId: string,
      paramName: string,
      value: BlockParameterValue,
    ) => {
      try {
        set((state) => {
          const block = state.nodes.find((e) => e.id === blockId);
          if (!block) {
            throw new Error("Block not found");
          }

          if (!block.data.initCtrls) {
            throw new Error("Block has no init parameters");
          }

          block.data.initCtrls[paramName].value = value;
        });
      } catch (e) {
        return Err(e as Error);
      }

      sendEventToMix("Control Input Data Updated", {
        blockId,
        paramName,
        value,
      });

      setHasUnsavedChanges(true);

      return Ok(undefined);
    },

    updateBlockLabel: (blockId: string, name: string) => {
      try {
        set((state) => {
          const node = state.nodes.find((n) => n.data.id === blockId);
          if (node === undefined) {
            throw new Error("Block not found");
          }

          if (name === node?.data.label) {
            return;
          }

          const isDuplicate = state.nodes.find(
            (n) => n.data.label === name && n.data.id !== blockId,
          );
          if (isDuplicate) {
            throw new Error(
              `There is another node with the same label: ${name}`,
            );
          }
          node.data.label = name;
        });
      } catch (e) {
        return Err(e as Error);
      }

      sendEventToMix("Block Name Changed", { blockId, name });
      setHasUnsavedChanges(true);

      return Ok(undefined);
    },

    addTextNode: (pos: XYPosition) => {
      set((state) => {
        state.textNodes.push({
          id: `TextNode-${uuidv4()}`,
          position: addRandomPositionOffset(pos, 30),
          type: "TextNode",
          data: {
            text: "Enter text here",
          },
        });
      });

      setHasUnsavedChanges(true);
    },

    updateTextNodeText: (id: string, text: string) => {
      try {
        set((state) => {
          const node = state.textNodes.find((n) => n.id === id);
          if (node === undefined) {
            throw new Error("Text node not found");
          }
          node.data.text = text;
        });
      } catch (e) {
        return Err(e as Error);
      }
      sendEventToMix("Text Node Updated", { id, text });
      setHasUnsavedChanges(true);
      return Ok(undefined);
    },

    deleteTextNode: (id: string) => {
      set((state) => {
        state.textNodes = state.textNodes.filter((n) => n.id !== id);
      });
      setHasUnsavedChanges(true);
    },

    saveProject: async () => {
      const fileContent = JSON.stringify(
        {
          name: get().name,
          rfInstance: {
            nodes: get().nodes,
            edges: get().edges,
          },
          textNodes: get().textNodes,
        },
        undefined,
        4,
      );

      const projectPath = get().path;
      if (projectPath) {
        sendEventToMix("Saving Project");
        return tryCatch(() =>
          window.api.saveFile(projectPath, fileContent),
        ).andThen(() => {
          setHasUnsavedChanges(false);
          return Ok(projectPath);
        });
      }

      const basename =
        get()
          .name?.split(" ")
          .map((s) => s.toLowerCase().trim())
          .filter((s) => s !== "")
          .join("-") ?? "app";
      const defaultFilename = `${basename}.json`;

      const res = await tryCatchPromise(() =>
        window.api.saveFileAs(defaultFilename, fileContent),
      );

      return res.andThen(({ filePath, canceled }) => {
        if (canceled || filePath === undefined) {
          return Err(new Error("Save was cancelled"));
        }

        set({ path: filePath });

        setHasUnsavedChanges(false);
        return Ok(filePath);
      });
    },
  })),
);

export const useLoadProject = () => {
  const wipeBlockResults = useSocketStore(
    useShallow((state) => state.wipeBlockResults),
  );

  const manifest = useManifest();
  const metadata = useMetadata();

  return useCallback(
    (project: Project, path?: string) => {
      if (!manifest || !metadata) {
        return Err(
          new Error(
            "Manifest and metadata are still loading, can't load project yet.",
          ),
        );
      }

      const {
        name,
        rfInstance: { nodes, edges },
        textNodes,
      } = project;
      const [syncedNodes, syncedEdges] = syncFlowchartWithManifest(
        nodes,
        edges,
        manifest,
        metadata,
      );

      useProjectStore.setState({
        nodes: syncedNodes,
        edges: syncedEdges,
        textNodes: textNodes ?? [],
        name,
        path,
      });

      setHasUnsavedChanges(false);
      wipeBlockResults();

      sendEventToMix("Project Loaded");

      return Ok(undefined);
    },
    [manifest, metadata, wipeBlockResults],
  );
};

export const useAddBlock = () => {
  const { setNodes } = useProtectedGraphUpdate();

  const center = useFlowchartStore(useShallow((state) => state.centerPosition));
  const hardwareDevices: DeviceInfo | undefined = useHardwareStore(
    useShallow((state) => state.devices),
  );
  const metadata = useMetadata();

  return useCallback(
    (node: BlockDefinition) => {
      const previousBlockPos = localStorage.getItem("prev_node_pos");

      const res = tryParse(positionSchema)(previousBlockPos);
      const pos = res.isOk() ? res.value : center;

      const nodePosition = addRandomPositionOffset(pos, 300);
      const {
        key: funcName,
        type,
        parameters: params,
        init_parameters: initParams,
        inputs,
        outputs,
        pip_dependencies,
      } = node;

      const path =
        metadata && `${funcName}.py` in metadata
          ? metadata[`${funcName}.py`].path
          : "";

      const nodeId = createNodeId(node.key);
      const nodeLabel =
        funcName === "CONSTANT"
          ? params!["constant"].default?.toString()
          : createNodeLabel(node.key, getTakenNodeLabels(funcName));

      const nodeCtrls = ctrlsFromParams(params, funcName, hardwareDevices);
      const initCtrls = ctrlsFromParams(initParams, funcName);

      const newNode: Node<BlockData> = {
        id: nodeId,
        type,
        data: {
          id: nodeId,
          label: nodeLabel ?? "New Block",
          func: funcName,
          type,
          ctrls: nodeCtrls,
          initCtrls: initCtrls,
          inputs,
          outputs,
          pip_dependencies,
          path,
        },
        position: nodePosition,
      };

      setNodes((nodes) => {
        nodes.push(newNode);
      });

      localStorage.setItem("prev_block_pos", JSON.stringify(nodePosition));
      sendEventToMix("Node Added", { nodeTitle: newNode.data?.label ?? "" });
    },
    [setNodes, center, metadata, hardwareDevices],
  );
};

export const useDeleteBlock = () => {
  const { setNodes, setEdges } = useProtectedGraphUpdate();

  return useCallback(
    (nodeId: string, nodeLabel: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
      sendEventToMix(MixPanelEvents.nodeDeleted, { nodeTitle: nodeLabel });
    },
    [setNodes, setEdges],
  );
};

export const useDuplicateBlock = () => {
  const { setNodes } = useProtectedGraphUpdate();

  return useCallback(
    (node: Node<BlockData>): Result<void> => {
      const funcName = node.data.func;
      const id = createNodeId(funcName);

      const newNode: Node<BlockData> = {
        ...node,
        id,
        data: {
          ...node.data,
          id,
          label:
            node.data.func === "CONSTANT"
              ? node.data.ctrls["constant"].value!.toString()
              : createNodeLabel(funcName, getTakenNodeLabels(funcName)),
        },
        position: {
          x: node.position.x + 30,
          y: node.position.y + 30,
        },
        selected: true,
      };

      try {
        setNodes((prev) => {
          const original = prev.find((n) => node.id === n.id);
          if (!original) {
            throw new Error("Failed to find original node when duplicating");
          }

          original.selected = false;
          prev.push(newNode);
        });
      } catch (e) {
        return Err(e as Error);
      }

      return Ok(undefined);
    },
    [setNodes],
  );
};

export const useCreateEdge = () => {
  const { setEdges } = useProtectedGraphUpdate();
  const manifest = useManifest();

  return (connection: Connection): Result<void, Error | TypeError> => {
    if (!manifest) {
      return Err(new Error("Manifest not found, can't connect to edge"));
    }

    const [sourceType, targetType] = getEdgeTypes(manifest, connection);
    console.log(sourceType, targetType);
    if (!isCompatibleType(sourceType, targetType)) {
      return Err(
        new TypeError(
          `Source type ${sourceType} and target type ${targetType} are not compatible`,
        ),
      );
    }

    console.log("creating edge", connection);
    setEdges((edges) => addEdge(connection, edges));
    return Ok(undefined);
  };
};

export const useGraphResync = () => {
  const { setEdges, setNodes } = useProtectedGraphUpdate();

  const { nodes, edges } = useProjectStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
    })),
  );

  const manifest = useManifest();
  const metadata = useMetadata();
  const { manifestChanged, setManifestChanged } = useManifestStore(
    useShallow((state) => ({
      manifestChanged: state.manifestChanged,
      setManifestChanged: state.setManifestChanged,
    })),
  );

  useEffect(() => {
    if (manifest && metadata && manifestChanged) {
      const [syncedNodes, syncedEdges] = syncFlowchartWithManifest(
        nodes,
        edges,
        manifest,
        metadata,
      );

      setNodes(syncedNodes);
      setEdges(syncedEdges);
      toast("Synced blocks with manifest.");
      setManifestChanged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, metadata, manifestChanged]);
};

export const useAddTextNode = () => {
  const addTextNode = useProjectStore(useShallow((state) => state.addTextNode));
  const center = useFlowchartStore(useShallow((state) => state.centerPosition));

  return useCallback(() => {
    const pos = center ?? { x: 0, y: 0 };
    addTextNode(pos);
    sendEventToMix("Text Node Added");
  }, [addTextNode, center]);
};

export const useClearCanvas = () => {
  const { setNodes, setEdges, setTextNodes } = useProtectedGraphUpdate();

  return () => {
    setNodes([]);
    setEdges([]);
    setTextNodes([]);
  };
};

function setter<K extends keyof State>(field: K) {
  type T = State[K];
  return (update: T | ((draft: Draft<T>) => void)) => {
    if (typeof update === "function") {
      useProjectStore.setState((state) => {
        const res = update(state[field]);
        if (res !== undefined) {
          state[field] = res;
        }
      });
    } else {
      useProjectStore.setState({ [field]: update });
    }
    setHasUnsavedChanges(true);
  };
}

const useProtectedGraphUpdate = () => {
  const { withPermissionCheck } = useWithPermission();
  const setNodes = setter("nodes");
  const setEdges = setter("edges");
  const setTextNodes = setter("textNodes");

  return {
    setNodes: withPermissionCheck(setNodes),
    setEdges: withPermissionCheck(setEdges),
    setTextNodes: withPermissionCheck(setTextNodes),
  };
};

const setHasUnsavedChanges = (val: boolean) => {
  useProjectStore.setState({ hasUnsavedChanges: val });
  window.api.setUnsavedChanges(true);
};

const getTakenNodeLabels = (func: string) => {
  const { nodes } = useProjectStore.getState();
  const re = new RegExp(`^${func.replaceAll("_", " ")}( \\d+)?$`);
  const matches = filterMap(nodes, (n) => n.data.label.match(re));
  return matches;
};

function resolveDefaultProjectReference() {
  if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search);
    return query.get("project"); // TODO: set these env through electron API as process is not accessible at this level
  }
  return undefined;
}

function resolveProjectReference(project: string | null | undefined) {
  if (!project) {
    return null;
  }

  if (RECIPES[project]) {
    return RECIPES[project];
  } else if (galleryItems[project]) {
    return galleryItems[project].rfInstance;
  } else if (ExampleProjects[project]) {
    return ExampleProjects[project].rfInstance;
  }
}
