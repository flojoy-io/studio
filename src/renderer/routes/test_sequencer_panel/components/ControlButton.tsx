import LockableButton from "./lockable/LockedButtons";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import _ from "lodash";
import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import {
  testSequenceRunRequest,
  testSequenceStopRequest,
  testSequencePauseRequest,
  testSequenceResumeRequest,
} from "@/renderer/routes/test_sequencer_panel/models/models";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { useContext } from "react";
import { Button } from "@/renderer/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { toast } from "sonner";


export function ControlButton() {
  const { setElems, tree, setIsLocked, backendGlobalState, backendState, clearPreviousRuns } = useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);

  const resetStatus = () => {
    setElems.withException((elems: TestSequenceElement[]) => {
      const newElems: TestSequenceElement[] = [...elems].map((elem) => {
        return elem.type === "test"
          ? {
              ...elem,
              status: "pending",
              completionTime: undefined,
              isSavedToCloud: false,
            }
          : { ...elem };
      });
      return newElems;
    });
    clearPreviousRuns();
  };

  const handleClickRunTest = () => {
    console.log("Start test");
    setIsLocked(true);
    resetStatus();
    tSSendJsonMessage(testSequenceRunRequest(tree));
  };
  const handleClickStopTest = () => {
    console.log("Stop test");
    tSSendJsonMessage(testSequenceStopRequest(tree));
    setIsLocked(false);
  };

  const handleClickPauseTest = () => {
    toast.warning("Pausing test sequencer after this test.");
    if (backendGlobalState === "test_set_start") {
      console.log("Pause test");
      tSSendJsonMessage(testSequencePauseRequest(tree));
    }
  }

  const handleClickResumeTest = () => {
    toast.info("Resuming test sequencer.");
    if (backendGlobalState === "test_set_start") {
      console.log("Resume test");
      tSSendJsonMessage(testSequenceResumeRequest(tree));
    }
  }

  return (
    <div className="flex w-full mt-4">
      <LockableButton
        variant="dotted"
        className="gap-2 flex-grow"
        isLocked={_.isEmpty(tree)}
        isException={backendGlobalState === "test_set_start"}
        onClick={
          backendGlobalState === "test_set_start"
            ? handleClickStopTest
            : handleClickRunTest
        }
      >
        {backendGlobalState === "test_set_start"
          ? "Stop Test Sequence"
          : "Run Test Sequence"}
      </LockableButton>
      { backendGlobalState === "test_set_start" && (
        <div className="flex flex-none mt-1">
        <Button className="flex-none ml-2" disabled={backendState !== "paused"} variant="outline" size="icon">
          <PlayIcon className="h-4 w-4 bg-grey" onClick={handleClickResumeTest} />
        </Button>
        <Button className="flex-none ml-2" disabled={backendState !== "running"} variant="outline" size="icon">
          <PauseIcon className="h-4 w-4 bg-grey" onClick={handleClickPauseTest} />
        </Button>
        </div>
      )}
    </div>
  );
}
