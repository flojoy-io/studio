import { useEffect, useState } from "react";
import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { ReactFlowJsonObject } from "reactflow";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { useControlsState } from "@hooks/useControlsState";
import Turnstone from "turnstone";
import { SearchIcon } from "lucide-react";

interface listBox {
  name: string;
  displayField: string;
  data: nodeName[];
  id: string;
  ratio: number;
  searchType?: "startswith" | "contains";
}
interface nodeName {
  name: string;
  type: string;
  parent: string;
}

const linkTest =
  "https://raw.githubusercontent.com/flojoy-io/docs/main/docs/nodes/AI_ML/CLASSIFICATION/ACCURACY/examples/EX1/app.txt";

const listbox: listBox[] = [
  {
    name: "AI/ML",
    displayField: "name",
    data: [
      {
        name: "ACCURACY",
        type: "CLASSIFICATION",
        parent: "AI/ML",
      },
      {
        name: "LEAST_SQUARES",
        type: "REGRESSION",
        parent: "AL/ML",
      },
    ],
    id: "AI",
    ratio: 1,
    searchType: "startswith",
  },
  {
    name: "TRANSFORMERS",
    displayField: "name",
    data: [
      {
        name: "FFT",
        type: "SIGNAL_PROCESSING",
        parent: "TRANSFORMERS",
      },
      {
        name: "ADD",
        type: "ARITHMETIC",
        parent: "TRANSFORMERS",
      },
    ],
    id: "TRANSFORMERS",
    ratio: 1,
    searchType: "startswith",
  },
];

const style = {
  //input: "w-full border rounded border-gray-500 bg-gray-800 px-7 py-3 pl-10 outline-none",
  input:
    "w-full h-12 border bg-modal border-slate-300 py-2 pl-10 pr-7 text-xl outline-none rounded",
  inputFocus:
    "w-full h-12 border bg-modal dark:bg-stone-800 border-accent1-hover py-2 pl-10 pr-7 text-xl outline-none rounded",
  listbox:
    "w-full bg-stone-800 sm:border sm:border-slate-300 sm:rounded text-left sm:mt-2 p-2 sm:drop-shadow-xl",
  item: "cursor-pointer overflow-hidden overflow-ellipsis",
  highlightedItem:
    "cursor-pointer rounded overflow-hidden bg-cyan-100 text-stone-700",
  match: "font-semibold",
  groupHeading: "cursor-default px-1.5 uppercase text-purple-300",
};

export const AppGallerySearch = () => {
  const [focus, setFocus] = useState(false);
  const [data, setData] = useState<object[]>([]);
  const onBlur = () => setFocus(false);
  const onFocus = () => setFocus(true);

  const { loadFlowExportObject } = useFlowChartGraph();
  const { setIsGalleryOpen } = useFlowChartState();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();

  const handleSelect = async (selectItem: nodeName) => {
    const response = await fetch(
      `https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/${selectItem.parent}/${selectItem.type}/${selectItem.name}/examples/EX1/app.txt`
    );
    const raw = await response.json();
    const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, any>;
    setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
    loadFlowExportObject(flow);
    setIsGalleryOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.github.com/repos/flojoy-ai/nodes/contents/?ref=main"
      );
      const json = await response.json();
      setData(json.filter((obj) => obj["type"] === "dir"));
    };

    fetchData().catch(console.error);
    console.log(data);
  }, []);

  const displayIconStyle = focus
    ? "text-accent1-hover"
    : "incline-flex text-stone-500";

  return (
    <div className="relative top-2">
      {/*<svg*/}
      {/*  className="absolute left-2 top-3 w-6 text-white"*/}
      {/*  fill="none"*/}
      {/*  stroke="currentColor"*/}
      {/*  viewBox="0 0 24 24"*/}
      {/*  xmlns="http://www.w3.org/2000/svg"*/}
      {/*>*/}
      {/*  <path*/}
      {/*    stroke-linecap="round"*/}
      {/*    stroke-linejoin="round"*/}
      {/*    stroke-width="2"*/}
      {/*    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"*/}
      {/*  ></path>*/}
      {/*</svg>*/}
      <span className="absolute left-2 top-3 z-10 w-6 items-center justify-center">
        <SearchIcon className={displayIconStyle} />
      </span>
      <Turnstone
        id="autocomplete"
        placeholder="Search node name"
        noItems="No node found"
        listbox={listbox}
        listboxIsImmutable={true}
        styles={style}
        onEnter={handleSelect}
        onSelect={handleSelect}
        onBlur={onBlur}
        onFocus={onFocus}
        matchText={true}
      />
    </div>
  );
};
