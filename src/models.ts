import { VirtualItem } from "react-virtual";

type ScrollAlignment = 'start' | 'center' | 'end' | 'auto'

interface ScrollToOffsetOptions {
  align: ScrollAlignment
}
export interface HeaderCell {
  colspan?: number;
  rowSpan?: number;
  stringValue: string;
  bottomCellIndex?: number;
  id?: string;
}

export interface UnicHeaderCell extends HeaderCell {
  id?: string;
}

export interface ColumnVirtualizer {
  virtualItems: VirtualItem[];
  totalSize: number;
  scrollToOffset: (index: number, options?: ScrollToOffsetOptions  | undefined) => void;
  scrollToIndex: (index: number, options?: ScrollToOffsetOptions  | undefined) => void;
  measure: () => void;
}
