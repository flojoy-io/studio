import { TableCell, TableRow } from "@/renderer/components/ui/table";
import { Row, flexRender } from "@tanstack/react-table";
import { useDrag } from "react-dnd";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { Test } from "@/renderer/types/test-sequencer";
import {
  ItemTypes,
  TestSequenceDropResult,
} from "@/renderer/routes/test_sequencer_panel/models/drag_and_drop";

export const GeneratedTest = ({ row, ...props }: { row: Row<Test> }) => {
  const { elems, setElems } = useTestSequencerState();
  const [, drag] = useDrag(
    () => ({
      type: ItemTypes.TestElementRow,
      item: { row: row },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<TestSequenceDropResult>();
        if (item && dropResult) {
          setElems((elems) => {
            const newElems = [...elems];
            newElems.splice(dropResult.targetIdx, 0, item.row.original);
            return newElems;
          });
        }
      },
    }),
    [elems],
  );
  return (
    <TableRow
      className="relative"
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      ref={drag}
      {...props}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};
