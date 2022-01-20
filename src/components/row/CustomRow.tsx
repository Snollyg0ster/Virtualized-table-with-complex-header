import { makeStyles } from "@mui/styles";
import { memo, MouseEvent, useMemo, } from "react";
import { VirtualItem } from "react-virtual";
import { ColumnVirtualizer } from "../../models";
import { compareExcept } from "../../utils";
import BodyCell from "../cell";

const dragAreaHeight = 4;

const useStyles = makeStyles({
  resize: {
    position: "relative",
    height: dragAreaHeight,
    cursor: 'row-resize',
    zIndex: 2,
  },
});

interface CustomRowProps {
  virtualRow: VirtualItem;
  columnVirtualizer: ColumnVirtualizer;
  cellsWidth: number[];
  cellHeight: number;
  handleColumnIndex: (index: number) => void;
  handleDrag: (e: MouseEvent, isDrag: boolean, xCoord: number) => void;
  handleRowIndex: (index: number) => void;
  handleRowDrag: (e: MouseEvent, isRowDrag: boolean, YCoord: number) => void;
}

const CustomRow = memo((props: CustomRowProps) => {
  const { virtualRow, cellsWidth, columnVirtualizer, handleColumnIndex,
    handleDrag, cellHeight, handleRowIndex, handleRowDrag } = props;

  const onMouseDown = (e: MouseEvent, index: number) => {
    handleRowDrag(e, true, e.screenY);
    handleRowIndex(index)
  };

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
      <div className={classes.resize} onMouseDown={(e) => onMouseDown(e, virtualRow.index - 1)} />
      <div style={{ zIndex: 0 }}>{columnVirtualizer.virtualItems.map((virtualColumn) => (
        <BodyCell
          key={virtualColumn.index}
          rowIndex={virtualRow.index}
          cellWidth={cellsWidth[virtualColumn.index]}
          virtualColumn={virtualColumn}
          handleDrag={handleDrag}
          handleColumnIndex={handleColumnIndex}
        />
      ))}</div>
      <div
        style={{ marginTop: cellHeight - dragAreaHeight * 2 }}
        className={classes.resize}
        onMouseDown={(e) => onMouseDown(e, virtualRow.index)} />
    </div>
  )
}, (a, b) => compareExcept(a, b, 'handleDrag', 'handleColumnIndex',
  'handleRowDrag', 'handleRowIndex'));

export default CustomRow;