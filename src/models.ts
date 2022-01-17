export interface HeaderCell {
  colspan?: number;
  rowSpan?: number;
  stringValue: string;
  touchHeaderBottom?: boolean;
  id?: string;
}

export interface UnicHeaderCell extends HeaderCell {
  id?: string;
}
