import "react-grid-layout/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import "./Controls.css";
import "../../App.css";
import ControlComponent from "./controlComponent";
import { useEffect } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);
export interface ControlProps {
  theme: any;
  isEditMode: any;
  results: any;
  updateCtrlValue: any;
  attachParam2Ctrl: any;
  rmCtrl: any;
  setCurrentInput: any;
  setOPenEditModal: any;
}

export default function ControlGrid({
  controlProps,
}: {
  controlProps: ControlProps;
}) {
  const { ctrlsManifest, gridLayout, setGridLayout } = useFlowChartState();
  const { isEditMode } = controlProps;

  useEffect(() => {
    if (isEditMode) {
      setGridLayout((prev) =>
        prev.map((layout) => ({ ...layout, static: false }))
      );
    } else {
      setGridLayout((prev) =>
        prev.map((layout) => ({ ...layout, static: true }))
      );
    }
  }, [isEditMode, setGridLayout]);

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: gridLayout, md: gridLayout, sm: gridLayout }}
      cols={{ lg: 8, md: 8, sm: 6, xs: 4, xxs: 2 }}
      onLayoutChange={(currentLayout, allLayout) => {
        setGridLayout(currentLayout);
      }}
    >
      {ctrlsManifest.map((ctrl, i) => {
        if (ctrl.hidden && !isEditMode) {
          return (
            <div
              key={ctrl.id}
              data-grid={{
                ...gridLayout.find((l) => l.i === ctrl.id),
              }}
              style={{
                display: "none",
              }}
              data-cy="ctrl-grid-item"
            />
          );
        }
        return (
          <div
            key={ctrl.id}
            data-grid={{
              ...gridLayout.find((l) => l.i === ctrl.id),
              static: !isEditMode,
            }}
            style={{
              ...(controlProps.theme === "dark" && {
                backgroundColor: "#191919",
              }),
              borderRadius: "16px",
            }}
            data-cy="ctrl-grid-item"
          >
            <Control
              key={ctrl.id}
              controlProps={controlProps}
              ctrl={ctrl}
              ctrlIndex={i}
            />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}

function Control({
  controlProps,
  ctrl,
}: {
  controlProps: ControlProps;
  ctrl: any;
  ctrlIndex: number;
}) {
  const {
    isEditMode,
    theme,
    results,
    updateCtrlValue,
    attachParam2Ctrl,
    rmCtrl,
    setCurrentInput,
    setOPenEditModal,
  } = controlProps;

  return (
    <div
      className={isEditMode ? "ctrl-input" : ""}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        backgroundColor: theme === "dark" ? "#14131361" : "#58454517",
      }}
    >
      {isEditMode ? (
        <ControlComponent
          ctrlObj={ctrl}
          theme={theme}
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParam2Ctrl={attachParam2Ctrl}
          rmCtrl={rmCtrl}
          setCurrentInput={setCurrentInput}
          setOPenEditModal={setOPenEditModal}
        />
      ) : ctrl.hidden ? null : (
        <ControlComponent
          ctrlObj={ctrl}
          theme={theme}
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParam2Ctrl={attachParam2Ctrl}
          rmCtrl={rmCtrl}
          setCurrentInput={setCurrentInput}
          setOPenEditModal={setOPenEditModal}
        />
      )}
    </div>
  );
}
