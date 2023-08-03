import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "flojoy/types";
import { Node, useOnSelectionChange } from "reactflow";
import NodeEditModal from "./NodeEditModal";

type NodeEditMenuProps = {
  selectedNode: Node<ElementsData> | null;
  unSelectedNodes: Node<ElementsData>[] | null; //used in ParamField.tsx for references
  nodes: Node<ElementsData>[];
  setNodes: (nodes: Node<ElementsData>[]) => void;
};

export const NodeEditMenu = ({
  selectedNode,
  unSelectedNodes,
  nodes,
  setNodes,
}: NodeEditMenuProps) => {
  const { isEditMode, setIsEditMode } = useFlowChartState();

  const onSelectionChange = () => {
    if (!selectedNode) {
      setIsEditMode(false);
    }
  };
  useOnSelectionChange({ onChange: onSelectionChange });

  return (
    <div className="relative">
      {selectedNode && isEditMode && (
        <NodeEditModal
          node={selectedNode}
          otherNodes={unSelectedNodes}
          nodes={nodes}
          setNodes={setNodes}
        />
      )}
    </div>
  );
};
