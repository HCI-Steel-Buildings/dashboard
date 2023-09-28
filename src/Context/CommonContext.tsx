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
// const BACKEND_API_ENDPOINT =
//   "https://api.hcisteelbuildings.com/api/monday-data";

const BACKEND_API_ENDPOINT = "/api/monday-data";

const CommonContext = createContext<CommonContextValue | any>({
  data: null,
  loading: true,
});

export const CommonContextProvider: React.FC<CommonProviderProps> = ({
  children,
}) => {
  const [boardData, setBoardData] = useState<MondayData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadBoardData() {
      const fetchedData = await fetchDataFromMonday();
      console.log(fetchedData);

      if (fetchedData) {
        const { columns, items } = fetchedData;

        // Skip the first two columns
        const adjustedColumns = columns.slice(2);

        // Create normalized items
        const normalizedItems: NormalizedItem[] = items.map((item: Item) => {
          const normalizedItem: NormalizedItem = { name: item.name };
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

    loadBoardData();
  }, []);

  return (
    <CommonContext.Provider value={{ data: boardData, loading }}>
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
