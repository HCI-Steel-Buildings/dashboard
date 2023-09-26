import { ReactNode } from "react";

export interface ColumnValue {
  text: string;
  value: any;
}

export interface Item {
  name: string;
  column_values: ColumnValue[];
}

export interface MondayData {
  name: string;
  columns: {
    title: string;
    type: string;
  }[];
  items: Item[];
}

export interface MondayDataContextValue {
  data: MondayData | null;
  loading: boolean;
  weeklyCounts: number[];
}

export interface MondayDataProviderProps {
  children: ReactNode;
}
