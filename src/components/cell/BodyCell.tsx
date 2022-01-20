import { makeStyles } from "@mui/styles";
import { memo, MouseEvent } from "react";
import { VirtualItem } from "react-virtual";
import { compareExcept } from "../../utils";

const useStyles = makeStyles({
  bodyCell: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    boxSizing: "border-box",
    borderWidth: '1px 0 0 1px',
    borderColor: 'black',
    borderStyle: "solid",
    display: 'flex',
  },
  label: {
    height: "100%",
    width: "100%",
  },
  resizeFromStart: {
    height: "100%",
    width: 4,
    marginRight: -4,
    cursor: 'col-resize',
    zIndex: 1,
  },
  resizeFromEnd: {
    height: "100%",
    width: 4,
    marginLeft: -4,
    cursor: 'col-resize',
  },
});

interface BodyCellProps {
  virtualColumn: VirtualItem;
  cellWidth: number;
  rowIndex: number;
  handleColumnIndex: (index: number) => void;
  handleDrag: (e: MouseEvent, isDrag: boolean, xCoord: number) => void;
}

const BodyCell = memo((props: BodyCellProps) => {
  const { virtualColumn, cellWidth, rowIndex, handleColumnIndex, handleDrag } = props;

  const onMouseDown = (e: MouseEvent, index: number) => {
    handleDrag(e, true, e.screenX);
    handleColumnIndex(index)
  };

  const classes = useStyles();

  return (
    <div
      key={virtualColumn.index}
      ref={virtualColumn.measureRef}
      className={classes.bodyCell}
      style={{
        width: cellWidth,
        transform: `translateX(${virtualColumn.start}px)`
      }}
    >
      <div className={classes.resizeFromStart} onMouseDown={(e) => onMouseDown(e, virtualColumn.index - 1)} />
      <div className={classes.label}>{`${rowIndex} ${virtualColumn.index}`}</div>
      <div className={classes.resizeFromEnd} onMouseDown={(e) => onMouseDown(e, virtualColumn.index)} />
    </div>
  )
}, (a, b) => compareExcept(a, b, 'handleDrag', 'handleColumnIndex'));

export default BodyCell;