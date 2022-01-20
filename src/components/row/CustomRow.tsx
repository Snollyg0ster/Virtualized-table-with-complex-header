import { makeStyles } from "@mui/styles";
import { memo, MouseEvent, useMemo, } from "react";
import { VirtualItem } from "react-virtual";
import { ColumnVirtualizer } from "../../models";
import { compareExcept } from "../../utils";
import BodyCell from "../cell";

const dragAreaHeight = 4;

const useStyles = makeStyles({
  resizeTop: {
    position: "relative",
    height: dragAreaHeight,
    marginBottom: -dragAreaHeight,
    cursor: 'row-resize',
    zIndex: 2,
  },
  resizeBottom: {
    position: "relative",
    height: dragAreaHeight,
    cursor: 'row-resize',
    zIndex: 2,
  },
  row: {
    zIndex: 0,
    display: 'flex',
    position: "absolute",
    height: '100%'
  }
});

interface CustomRowProps {
  virtualRowIndex: number;
  columnVirtualizer: ColumnVirtualizer;
  cellsWidth: number[];
  cellHeight: number;
  handleColumnIndex: (index: number) => void;
  handleDrag: (e: MouseEvent, isDrag: boolean, xCoord: number) => void;
  handleRowIndex: (index: number) => void;
  handleRowDrag: (e: MouseEvent, isRowDrag: boolean, YCoord: number) => void;
}

const CustomRow = memo((props: CustomRowProps) => {
  const { virtualRowIndex, cellsWidth, columnVirtualizer, handleColumnIndex,
    handleDrag, cellHeight, handleRowIndex, handleRowDrag } = props;

  const onMouseDown = (e: MouseEvent, index: number) => {
    handleRowDrag(e, true, e.screenY);
    handleRowIndex(index)
  };

  const classes = useStyles();

  return (
    <div
      key={`${virtualRowIndex}`}
      style={{
        position: 'relative',
        height: cellHeight,
        transform: `translateX(${columnVirtualizer.virtualItems[0].start}px)`,
      }}
    >
      <div className={classes.resizeTop} onMouseDown={(e) => onMouseDown(e, virtualRowIndex - 1)} />
      <div
        className={classes.row}
      >
        {columnVirtualizer.virtualItems.map((virtualColumn) => (
          <BodyCell
            key={virtualColumn.index}
            rowIndex={virtualRowIndex}
            cellWidth={cellsWidth[virtualColumn.index]}
            columnIndex={virtualColumn.index}
            handleDrag={handleDrag}
            handleColumnIndex={handleColumnIndex}
          />
        ))}</div>
      <div
        style={{ marginTop: cellHeight - dragAreaHeight }}
        className={classes.resizeBottom}
        onMouseDown={(e) => onMouseDown(e, virtualRowIndex)} />
    </div>
  )
}, (a, b) => compareExcept(a, b, 'handleDrag', 'handleColumnIndex',
  'handleRowDrag', 'handleRowIndex'));

export default CustomRow;