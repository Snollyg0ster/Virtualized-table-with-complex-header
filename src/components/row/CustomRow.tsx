import { makeStyles } from "@mui/styles";
import { memo, MouseEvent, useState } from "react";
import { VirtualItem } from "react-virtual";
import { ColumnVirtualizer } from "../../models";
import { compareExcept } from "../../utils";
import BodyCell from "../cell";

const useStyles = makeStyles({

});

interface CustomRowProps {
  virtualRow: VirtualItem;
  columnVirtualizer: ColumnVirtualizer;
  cellsWidth: number[];
  cellHeight: number;
  handleColumnIndex: (index: number) => void;
  handleDrag: (e: MouseEvent, isDrag: boolean, xCoord: number) => void;
}

const CustomRow = memo((props: CustomRowProps) => {
  const { virtualRow, cellsWidth, columnVirtualizer, cellHeight, handleColumnIndex, handleDrag } = props;

  const classes = useStyles();

  return (
    <div
      key={`${virtualRow.index}`}
      style={{
        position: "absolute",
        width: `${columnVirtualizer.totalSize}px`,
        height: cellHeight,
        transform: `translateY(${virtualRow.start}px)`
      }}
    >
      {columnVirtualizer.virtualItems.map((virtualColumn) => (
        <BodyCell
          key={virtualColumn.index}
          rowIndex={virtualRow.index}
          cellWidth={cellsWidth[virtualColumn.index]}
          virtualColumn={virtualColumn}
          handleDrag={handleDrag}
          handleColumnIndex={handleColumnIndex}
        />
      ))}
    </div>
  )
}, (a, b) => compareExcept(a, b, 'handleDrag', 'handleColumnIndex'));

export default CustomRow;