import { Button } from "@/renderer/components/ui/button";
import React, { useState } from 'react';
import { Input } from "@/renderer/components/ui/input";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import LockableButton from "./lockable/LockedButtons";


export function CloudPanel() {
  const [input1Value, setInput1Value] = useState('');
  const [input2Value, setInput2Value] = useState('');
  const { setElems, tree, setIsLocked } = useTestSequencerState();

  const handleInputChange1 = (e) => {
    setInput1Value(e.target.value);
  };

  const handleInputChange2 = (e) => {
    setInput2Value(e.target.value);
  };

  const handleExport = () => {
    // Handle form submission logic here
    setIsLocked(true);
    console.log("Input 1:", input1Value);
    console.log("Input 2:", input2Value);
  };

  return (
    <div className="rounded-xl border border-gray-300 min-w-[120px] rounded-xl border border-gray-300 py-4 dark:border-gray-800 p-4">


      <div class="flex flex-col">
        <h2 className="mb-2 text-lg font-bold text-accent1 pt-3 text-center "> Cloud Panel </h2>
        
        <div className="text-muted-foreground"><h2>Hardware id</h2></div>
        <div>
          <Input
            className="focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
            type="text"
            value={input1Value}
            onChange={handleInputChange1}
            placeholder="Scan or enter hardware id"
          />
        </div>

        <div className="text-muted-foreground"><h2>Test Sequence id</h2></div>
        <div>
          <Input
            className="focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
            type="text"
            value={input1Value}
            onChange={handleInputChange1}
            placeholder="Scan or enter hardware id"
          />
        </div>

        <div>
          <LockableButton 
            className="w-full mt-4"
            onClick={handleExport}
          >
            Submit Test Results 
          </LockableButton >
        </div>
      </div>
      
    </div>
  );
};

