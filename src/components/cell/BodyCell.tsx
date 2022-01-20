import { makeStyles } from "@mui/styles";
import { memo, MouseEvent } from "react";
import { VirtualItem } from "react-virtual";
import { compareExcept } from "../../utils";

const useStyles = makeStyles({
  bodyCell: {
    height: "100%",
    boxSizing: "border-box",
    borderWidth: '1px 0 0 1px',
    borderColor: 'black',
    borderStyle: "solid",
    display: 'flex',
  },
  labelCont: {
    height: "100%",
    width: "100%",
    textAlign: "center",
    verticalAlign: 'middle',
    position: "relative",
  },
  label: {
    position: "absolute",
    left: '50%',
    top: '50%',
    transform: "translate(-50%, -50%)",
    maxHeight: "100%",
    width: "100%",
    textAlign: "center",
    textOverflow: 'ellipsis',
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
  columnIndex: number;
  cellWidth: number;
  rowIndex: number;
  handleColumnIndex: (index: number) => void;
  handleDrag: (e: MouseEvent, isDrag: boolean, xCoord: number) => void;
}

const BodyCell = memo((props: BodyCellProps) => {
  const { columnIndex, cellWidth, rowIndex, handleColumnIndex, handleDrag } = props;

  const onMouseDown = (e: MouseEvent, index: number) => {
    handleDrag(e, true, e.screenX);
    handleColumnIndex(index)
  };
  const classes = useStyles();

  return (
    <div
      key={columnIndex}
      className={classes.bodyCell}
      style={{
        width: cellWidth,
      }}
    >
      <div className={classes.resizeFromStart} onMouseDown={(e) => onMouseDown(e, columnIndex - 1)} />
      <div className={classes.labelCont}>
        <div className={classes.label}>{`${rowIndex} ${columnIndex}`}</div>
      </div>
      <div className={classes.resizeFromEnd} onMouseDown={(e) => onMouseDown(e, columnIndex)} />
    </div>
  )
}, (a, b) => compareExcept(a, b, 'handleDrag',));

export default BodyCell;