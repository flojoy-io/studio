import { Leaf as NodeElement } from "@/renderer/utils/ManifestLoader";
import { Draft } from "immer";
import { useCallback } from "react";
import { Node, XYPosition } from "reactflow";
import { BlockData } from "@/renderer/types";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { centerPositionAtom } from "@/renderer/hooks/useFlowChartState";
import { useAtomValue } from "jotai";
import { addRandomPositionOffset } from "@/renderer/utils/RandomPositionOffset";
import { createNodeId, createNodeLabel } from "@/renderer/utils/NodeUtils";
import { ctrlsFromParams } from "@/renderer/utils/NodeUtils";
import {
  DeviceInfo,
  useHardwareDevices,
} from "@/renderer/hooks/useHardwareDevices";
import { BlockMetadataMap } from "@/renderer/types/blocks-metadata";

export type AddNewNode = (node: NodeElement) => void;

export const useAddNewNode = (
  setNodes: (
    update: Node<BlockData>[] | ((draft: Draft<Node<BlockData>>[]) => void),
  ) => void,
  getTakenNodeLabels: (func: string) => string[][],
  nodesMetadataMap: BlockMetadataMap | undefined | null,
) => {
  const center = useAtomValue(centerPositionAtom);
  const hardwareDevices: DeviceInfo | undefined = useHardwareDevices();

  return useCallback(
    (node: NodeElement) => {
      const previousBlockPos = localStorage.getItem("prev_node_pos");
      const parsedPos = previousBlockPos
        ? (JSON.parse(previousBlockPos) as XYPosition)
        : null;
      const pos = parsedPos ?? center;
      const nodePosition = addRandomPositionOffset(pos, 300);
      const {
        key: funcName,
        type,
        parameters: params,
        init_parameters: initParams,
        inputs,
        outputs,
        ui_component_id: uiComponentId,
        pip_dependencies,
      } = node;

      const path =
        nodesMetadataMap && `${funcName}.py` in nodesMetadataMap
          ? nodesMetadataMap[`${funcName}.py`].path
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
        type: uiComponentId ?? type,
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

      setNodes((els) => els.concat(newNode));
      localStorage.setItem("prev_block_pos", JSON.stringify(nodePosition));
      sendEventToMix("Node Added", { nodeTitle: newNode.data?.label ?? "" });
    },
    [center, nodesMetadataMap, getTakenNodeLabels, hardwareDevices, setNodes],
  );
};
