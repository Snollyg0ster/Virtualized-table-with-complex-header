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
  MutableRefObject,
  UIEvent,
  useCallback,
  memo
} from "react";
import { useVirtual } from "react-virtual";
import { makeStyles } from "@mui/styles";

const cellWidth = 130;
const cellHeight = 32;

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
    height: '90%',
    padding: 16,
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
  bodyCell: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    boxSizing: "border-box",
    borderWidth: '1px 0 0 1px',
    borderColor: 'black',
    borderStyle: "solid",
  },
  cell: {
    border: "1px solid black !important",
    padding: '2px 0 !important',
    background: 'white !important',
  }
});

type MaybeDiv = HTMLDivElement | null;

interface CustomCellProps {
  cell: UnicHeaderCell;
}

const CustomCell = (props: CustomCellProps) => {
  const { cell } = props;

  const classes = useStyles();
  return (
    <TableCell
      className={classes.cell}
      colSpan={cell.colspan}
      rowSpan={cell.rowSpan}
    >
      <div
        style={{
          width: cell.touchHeaderBottom ? cellWidth : "auto",
          textAlign: "center"
        }}
      >
        {cell.stringValue}
      </div>
    </TableCell>
  );
};

interface TableHeaderProps {
  headerData: UnicHeaderCell[][];
}

const TableHeader = memo((props: TableHeaderProps) => {
  const { headerData } = props;

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
                <CustomCell cell={cell} key={cell.id} />
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
  const headerRef = useRef<MaybeDiv>(null);
  const bodyRef = useRef<MaybeDiv>(null);
  const containerRef = useRef<MaybeDiv>(null);

  const rowsNumber = 1000;

  const [cellsWidth, setCellsWidth] = useState(
    Array.from({ length: bottomCellsNumber }, () => cellWidth + 1)
  );

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
        >
          <TableHeader
            headerData={headerData}
          />
          <div
            className={classes.bodyContainer}
            ref={bodyRef}
            style={{ height: rowVirtualizer.totalSize, width: columnVirtualizer.totalSize }}
          >
            {rowVirtualizer.virtualItems.map((virtualRow, i,) => (
              <div
                key={`${virtualRow.index}`}
                style={{
                  position: "absolute",
                  width: `${columnVirtualizer.totalSize}px`,
                  height: cellHeight,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                {columnVirtualizer.virtualItems.map((virtualColumn, i) => (
                  <div
                    key={virtualColumn.index}
                    ref={virtualColumn.measureRef}
                    className={classes.bodyCell}
                    style={{
                      minWidth: cellsWidth[i],
                      transform: `translateX(${virtualColumn.start}px)`
                    }}
                  >
                    {`${virtualRow.index} ${virtualColumn.index}`}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </div>
  );
}
