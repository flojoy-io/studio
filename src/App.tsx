import { useEffect, useState } from "react";

import ControlsTab from "./feature/controls_panel/ControlsTabView";
import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import ResultsTab from "./feature/results_panel/ResultsTabView";

import { useDisclosure } from "@mantine/hooks";
import { GlobalStyles } from "./feature/common/Global";
import { v4 as uuidv4 } from "uuid";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { CustomFonts } from "./feature/common/CustomFonts";
import PreJobOperationShow from "./feature/common/PreJobOperationShow";
import { darkTheme, lightTheme } from "./feature/common/theme";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FlowChartTab />,
  },
  {
    path: "/controls",
    element: <ControlsTab />,
  },
  {
    path: "/debug",
    element: <ResultsTab />,
  },
]);

const App = () => {
  const { states } = useSocket();
  const { runningNode, failedNode, preJobOperation } = states!;
  const [theme, setTheme] = useState<ColorScheme>("dark");
  const { setRunningNode, setFailedNode } = useFlowChartState();
  const [
    isPrejobModalOpen,
    { open: openPreJobModal, close: closePreJobModal },
  ] = useDisclosure(false);

  const toggleColorScheme = (color?: ColorScheme) => {
    setTheme(color || (theme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    console.log("1");
    setRunningNode(runningNode);
    setFailedNode(failedNode);
  }, [runningNode, failedNode, setRunningNode, setFailedNode]);

  useEffect(() => {
    console.log("3");
    if (preJobOperation.isRunning) {
      openPreJobModal();
    } else {
      closePreJobModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preJobOperation]);

  return (
    <ColorSchemeProvider
      colorScheme={theme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={theme === "dark" ? darkTheme : lightTheme}
      >
        <GlobalStyles />
        <PreJobOperationShow
          opened={isPrejobModalOpen}
          outputs={preJobOperation.output}
          close={closePreJobModal}
        />
        <CustomFonts />
        <RouterProvider router={router} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
