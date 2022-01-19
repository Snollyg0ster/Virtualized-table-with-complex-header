import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { getHeaderData } from "./utils";
import { UnicHeaderCell } from "./models";
import {
  useMemo,
  useState,
  useRef,
  useCallback,
  memo,
  MouseEvent,
  useEffect
} from "react";
import { useVirtual } from "react-virtual";
import { makeStyles } from "@mui/styles";
import CustomRow from "./components/row";
import ResizingLine from "./components/resizingLine";
import { margin } from "@mui/system";

const cellWidth = 130;
const minCellWidth = 50;
const maxCellWidth = 600;

const cellHeight = 32;

const paperPadding = 16;

const useStyles = makeStyles({
  app: {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
  },
  paper: {
    boxSizing: 'border-box',
    position: 'relative',
    height: '90%',
    padding: paperPadding,
  },
  tableContainer: {
    width: 'fit-content !important',
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  container: {
    position: 'relative',
    boxSizing: 'border-box',
    width: '100%',
    height: 800,
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255,255,255, 0.3) #424242',
    '&::-webkit-scrollbar': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      height: 8,
      width: 8,
      borderRadius: '9em',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.16)',
      borderRadius: '9em',
    },
  },
  bodyContainer: {
    overflow: 'hidden',
    borderWidth: '0 1px 1px 0',
    borderColor: 'black',
    borderStyle: "solid",
    zIndex: 1,
  },
  cell: {
    border: "1px solid black !important",
    padding: '2px 0 !important',
    background: 'white !important',
  },
  resizingLine: {
    boxSizing: "border-box",
    height: `calc(100% - ${paperPadding * 2}px) !important`,
    marginTop: paperPadding,
  }
});

type MaybeDiv = HTMLDivElement | null;

interface CustomCellProps {
  cell: UnicHeaderCell;
  cellWidth?: number;
}

const CustomCell = memo((props: CustomCellProps) => {
  const { cell, cellWidth } = props;

  const width = useMemo(() => (!cellWidth || Number.isNaN(cellWidth)) ? "auto" : cellWidth - 1, [cellWidth])

  const classes = useStyles();

  return (
    <TableCell
      className={classes.cell}
      colSpan={cell.colspan}
      rowSpan={cell.rowSpan}
    >
      <div
        style={{
          width,
          textAlign: "center"
        }}
      >
        {cell.stringValue}
      </div>
    </TableCell>
  );
});

interface TableHeaderProps {
  headerData: UnicHeaderCell[][];
  cellsWidth: number[];
}

const TableHeader = memo((props: TableHeaderProps) => {
  const { headerData, cellsWidth } = props;

  const classes = useStyles();

  return (
    <TableContainer
      className={classes.tableContainer}
    >
      <Table>
        <TableHead>
          {headerData.map((row, rowIndex) => (
            <TableRow key={`${rowIndex}`}>
              {row.map((cell) => (
                <CustomCell
                  cell={cell}
                  key={cell.id}
                  cellWidth={(cell.bottomCellIndex || cell.bottomCellIndex === 0) ? cellsWidth[cell.bottomCellIndex] : undefined} />
              ))}
            </TableRow>
          ))}
        </TableHead>
      </Table>
    </TableContainer>
  );
});

export default function App() {
  const { headerData, bottomCellsNumber } = useMemo(
    () => getHeaderData(60),
    []
  );
  const [isDrag, setIsDrag] = useState(false);
  const [savedXCoord, setSavedXCoord] = useState<number>();
  const [savedWidth, setSavedWidth] = useState(cellWidth);
  const [resizeColumnIndex, setResizeColumnIndex] = useState(0);
  const [showResizingLine, setShowResizingLine] = useState(false);
  const [resizingLinePosition, setResizingLinePosition] = useState(0);

  // console.log('isDrag = %s, resizeColumnIndex = %d, savedXCoord = %d', isDrag, resizeColumnIndex, savedXCoord);

  const bodyRef = useRef<MaybeDiv>(null);
  const containerRef = useRef<MaybeDiv>(null);

  const rowsNumber = 1000;

  const [cellsWidth, setCellsWidth] = useState(
    Array.from({ length: bottomCellsNumber }, () => cellWidth + 1)
  );

  const setResizingLineToCurPosition = (e: MouseEvent) => setResizingLinePosition(e.clientX - e.currentTarget.getBoundingClientRect().x);

  const handleDrag = (e: MouseEvent, isDrag: boolean, xCoord: number) => {
    setIsDrag(isDrag);
    setSavedXCoord(xCoord);
  };

  const handleColumnIndex = (index: number) => {
    setResizeColumnIndex(index)
    setSavedWidth(cellsWidth[index])
  };

  const handleColumnWidthChange = (width: number, index: number) => {
    setCellsWidth(arr => {
      const resultArray = arr.slice();
      resultArray[index] = width;
      return resultArray;
    })
  }

  const onMouseMove = (e: MouseEvent) => {
    if (isDrag && savedXCoord && savedXCoord !== e.clientX) {
      !showResizingLine && setShowResizingLine(true)
      let calculatedWidth = savedWidth + e.screenX - savedXCoord;
      if (calculatedWidth > maxCellWidth || calculatedWidth < minCellWidth) {
        return;
      }
      setResizingLineToCurPosition(e)
    }
  };

  const onMouseLeave = () => {
    setIsDrag(false);
    setShowResizingLine(false)
  }

  const disableDrag = (e: MouseEvent) => {
    setShowResizingLine(false)
    setIsDrag(false);
    if (savedXCoord && isDrag) {
      let calculatedWidth = savedWidth + e.screenX - savedXCoord;
      if (calculatedWidth < minCellWidth) {
        calculatedWidth = minCellWidth;
      }
      if (calculatedWidth > maxCellWidth) {
        calculatedWidth = maxCellWidth;
      }
      handleColumnWidthChange(calculatedWidth, resizeColumnIndex)
    }
  }

  useEffect(() => { console.log(isDrag) }, [isDrag])

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: bottomCellsNumber,
    estimateSize: useCallback((i) => cellsWidth[i], [cellsWidth]),
    parentRef: containerRef
  });

  const rowVirtualizer = useVirtual({
    size: rowsNumber,
    estimateSize: useCallback(() => cellHeight, []),
    parentRef: containerRef
  });

  const classes = useStyles();

  return (
    <div className={classes.app}>
      <Paper className={classes.paper}>
        <div
          ref={containerRef}
          className={classes.container}
          onMouseMove={onMouseMove}
          onMouseUp={disableDrag}
          onMouseLeave={onMouseLeave}
          style={{ userSelect: isDrag ? 'none' : 'auto', }}
        >
          <TableHeader
            headerData={headerData}
            cellsWidth={cellsWidth}
          />
          <div
            className={classes.bodyContainer}
            style={{ height: rowVirtualizer.totalSize, width: columnVirtualizer.totalSize }}
          >
            {rowVirtualizer.virtualItems.map((virtualRow, i) => (
              <CustomRow
                key={virtualRow.index}
                virtualRow={virtualRow}
                columnVirtualizer={columnVirtualizer}
                cellsWidth={cellsWidth}
                cellHeight={cellHeight}
                handleDrag={handleDrag}
                handleColumnIndex={handleColumnIndex}
              />
            ))}
          </div>
        </div>
        <ResizingLine show={showResizingLine} position={resizingLinePosition} injectedStyle={classes.resizingLine} />
      </Paper>
    </div>
  );
}
