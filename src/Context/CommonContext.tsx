import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Column,
  ColumnValue,
  NormalizedItem,
  MondayData,
  CommonContextValue,
  CommonProviderProps,
  Item,
  FetchedMondayData,
} from "./types";

const BACKEND_API_ENDPOINT =
  "https://api.hcisteelbuildings.com/api/monday-data";

const CommonContext = createContext<CommonContextValue | any>({
  data: null,
  loading: true,
  refreshData: async () => {}, // Default function
});

export const CommonContextProvider: React.FC<CommonProviderProps> = ({
  children,
}) => {
  const [boardData, setBoardData] = useState<MondayData | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshData() {
    setLoading(true);
    const fetchedData = await fetchDataFromMonday();
    if (fetchedData) {
      const { columns, items } = fetchedData;
      const adjustedColumns = columns.slice(2);

      const normalizedItems: NormalizedItem[] = items.map((item: Item) => {
        const normalizedItem: NormalizedItem = {
          id: item.id,
          name: item.name,
        };
        item.column_values.forEach(
          (columnValue: ColumnValue, index: number) => {
            const columnName = adjustedColumns[index].title;
            normalizedItem[columnName] = columnValue.text;
          }
        );
        return normalizedItem;
      });

      setBoardData({
        name: fetchedData.name,
        items: normalizedItems,
        columns: adjustedColumns,
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <CommonContext.Provider value={{ data: boardData, loading, refreshData }}>
      {children}
    </CommonContext.Provider>
  );
};

export const useCommonContext = () => {
  const context = useContext(CommonContext);
  if (!context) {
    throw new Error(
      "useCommonContext must be used within a CommonContextProvider"
    );
  }
  return context;
};

async function fetchDataFromMonday(): Promise<FetchedMondayData | null> {
  try {
    const response = await fetch(BACKEND_API_ENDPOINT);
    if (!response.ok) {
      console.error("Error fetching data from backend:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from backend:", error);
    return null;
  }
}
