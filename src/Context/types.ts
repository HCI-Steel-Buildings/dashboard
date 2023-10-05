interface Column {
  title: string;
  type: string;
}

interface ColumnValue {
  text: string;
  value: string | null;
}

interface NormalizedItem {
  name: string;
  id: string;
  [key: string]: string | undefined;
}

interface MondayData {
  name: string;
  items: NormalizedItem[];
  columns: Column[];
}

interface CommonContextValue {
  data: MondayData | null;
  loading: boolean;
}
interface CommonProviderProps {
  children: React.ReactNode;
}
interface Item {
  column_values: ColumnValue[];
  name: string;
  id: string;
}
interface FetchedMondayData {
  name: string;
  items: Item[];
  columns: Column[];
}

export type {
  Column,
  ColumnValue,
  NormalizedItem,
  MondayData,
  CommonContextValue,
  CommonProviderProps,
  Item,
  FetchedMondayData,
};
