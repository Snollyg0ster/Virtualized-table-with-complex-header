import { v4 as uuid } from "uuid";
import { HeaderCell, UnicHeaderCell } from "./models";

const headerCellsNames = [
  "заголовок",
  "название",
  "ячейка",
  "месторождение",
  "хэдер",
  "колонка"
];

const getRandomName = (array: string[]) =>
  array[Math.round(Math.random() * (array.length - 1))];

export const getHdeaderData = (
  columnLength: number,
  maxMergedСells: number = 16
) => {
  if (columnLength < maxMergedСells) {
    return [];
  }

  const rowLength = 4;
  let headerData: HeaderCell[][] = Array.from({ length: rowLength }, () => []);
  let remainingColumns = columnLength;

  while (remainingColumns > 0) {
    let remainingRows = rowLength;
    const vertCellsNumber = Math.ceil(Math.random() * rowLength);
    let horCellsNumber = Math.ceil(Math.random() * maxMergedСells);

    if (horCellsNumber > remainingColumns) {
      horCellsNumber = remainingColumns;
    }

    for (let i = vertCellsNumber - 1; i >= 0; i--) {
      if (i === vertCellsNumber - 1) {
        headerData[i].push(
          ...Array.from({ length: horCellsNumber }, () => ({
            stringValue: getRandomName(headerCellsNames),
            rowSpan: rowLength - i
          }))
        );
      } else {
      }
      remainingColumns -= vertCellsNumber;
    }
    return headerData;
  }
};

export const getHeaderData = (colNum: number) => {
  const rowLength = 4;
  let headerData: UnicHeaderCell[][] = Array.from({ length: rowLength }, () => []);
  let i = 0;
  while (i < colNum) {
    if (i % 5 === 0) {
      headerData[0].push({
        stringValue: getRandomName(headerCellsNames),
        colspan: 8,
        rowSpan: 4
      });
    } else if (i % 3 === 0) {
      headerData[0].push({
        stringValue: getRandomName(headerCellsNames),
        colspan: 8
      });
      headerData[1] = headerData[1].concat(
        new Array(2).fill({
          stringValue: getRandomName(headerCellsNames),
          colspan: 4
        })
      );
      headerData[2] = headerData[2].concat(
        new Array(4).fill({
          stringValue: getRandomName(headerCellsNames),
          colspan: 2
        })
      );
      headerData[3] = headerData[3].concat(
        new Array(8).fill({
          stringValue: getRandomName(headerCellsNames)
        })
      );
    } else if (i % 2 === 0) {
      headerData[0].push({
        stringValue: getRandomName(headerCellsNames),
        colspan: 8,
        rowSpan: 2
      });
      headerData[2] = headerData[2].concat(
        new Array(8).fill({
          stringValue: getRandomName(headerCellsNames),
          rowSpan: 2
        })
      );
    }
    headerData[0] = headerData[0].concat(
      new Array(8).fill({
        stringValue: getRandomName(headerCellsNames),
        rowSpan: 4
      })
    );
    i++;
  }

  let bottomCellsNumber = 0;

  headerData = headerData.map((row, rowIndex) =>
    row.map((cell) => {
      if (
        rowIndex === rowLength - 1 ||
        (cell.rowSpan && cell.rowSpan + rowIndex === rowLength)
      ) {
        bottomCellsNumber++;
        return {
          ...cell,
          bottomCellIndex: bottomCellsNumber - 1,
          id: uuid()
        };
      }
      return { ...cell, id: uuid() };
    })
  );

  return {
    headerData: headerData,
    bottomCellsNumber,
  };
};

//used for callback argument in memoized components, like: React.memo(() => (<></>), (a, b) => compareExcept(a, b, someProp, anotherProp, ...etc))
export const compareExcept = (a: any, b: any, ...exceptions: string[]) => {
  let doesNotUpdateComponent = true;
  const componentProps = Object.keys(a);

  let index = 0;
  while (index < componentProps.length && doesNotUpdateComponent) {
    const propertyName = componentProps[index];
    if (a[propertyName] !== b[propertyName] 
      && !exceptions.includes(propertyName)) {
      doesNotUpdateComponent = false;
    }
    index+=1;
  }

  return doesNotUpdateComponent;
}

export const isValid = (x: number | null | undefined) => x !== null
&& x !== undefined
&& !Number.isNaN(x)
&& x !== Infinity
&& x !== -Infinity;
