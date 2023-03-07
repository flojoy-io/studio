import { render, fireEvent, waitFor } from "@testing-library/react";
import FlowChartTab from "@src/feature/flow_chart_panel/FlowChartTabView";
import { FlowChartProps } from "@src/feature/flow_chart_panel/types/FlowChartProps";
import { Node, Edge, ReactFlowProvider } from "reactflow";
import NodeModal from "@src/feature/flow_chart_panel/views/NodeModal";

const props: FlowChartProps = {
  results: {
    io: [],
  },
  theme: "dark",
  rfInstance: {
    nodes: [],
    edges: [],
    viewport: {
      x: 1,
      y: 1,
      zoom: 1,
    },
  },
  setRfInstance: jest.fn(),
  clickedElement: undefined,
  setClickedElement: jest.fn(),
};

jest.mock("@src/feature/flow_chart_panel/views/NodeModal", () => {
  const mockComponent = (props) => <div />;
  return mockComponent;
});

jest.mock("@src/services/FlowChartServices", () => {
  return {
    saveFlowChartToLocalStorage: () => jest.fn(),
  };
});

jest.mock("@src/feature/flow_chart_panel/FlowChartTabState", () => {
  return {
    useFlowChartTabState: jest.fn().mockReturnValue({
      windowWidth: 1024,
      modalIsOpen: false,
      setIsModalOpen: jest.fn(),
      openModal: jest.fn(),
      afterOpenModal: jest.fn(),
      closeModal: jest.fn(),
      nd: {},
      setNd: jest.fn(),
      nodeLabel: "PYTHON FUNCTION",
      nodeType: "PYTHON FUNCTION TYPE",
      setNodeLabel: jest.fn(),
      setNodeType: jest.fn(),
      setPythonString: jest.fn(),
      pythonString: "...",
      defaultPythonFnLabel: "PYTHON FUNCTION",
      defaultPythonFnType: "PYTHON FUNCTION TYPE",
    }),
  };
});

jest.mock("@src/feature/flow_chart_panel/FlowChartTabEffects", () => {
  return {
    useFlowChartTabEffects: () => {},
  };
});

jest.mock("@src/configs/NodeConfigs", () => {
  return {
    default: jest.fn(),
  };
});

jest.mock("@src/hooks/useFlowChartState", () => {
  return {
    useFlowChartState: jest.fn().mockReturnValue({
      nodes: [] as Node[],
      setNodes: jest.fn(),
      edges: [] as Edge[],
      setEdges: jest.fn(),
    }),
  };
});

describe("FlowChartTabView", () => {
  it("should render the component correcty", () => {
    const { container } = render(<FlowChartTab {...props} />);
    expect(container).toMatchSnapshot();
  });
});
