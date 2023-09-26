import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ColumnValue,
  Item,
  MondayData,
  CommonContextValue,
  CommonProviderProps,
} from "./types";
import { parseDate } from "../Utils/dateUtils";

// Change this endpoint to point to your backend server hosted on DigitalOcean.
const BACKEND_API_ENDPOINT = "/api/monday-data";

const CommonContext = createContext<CommonContextValue | any>({
  data: null,
  loading: true,
  weeklyCounts: [0, 0, 0, 0, 0],
});

export const CommonContextProvider: React.FC<CommonProviderProps> = ({
  children,
}) => {
  const [boardData, setBoardData] = useState<MondayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyCounts, setWeeklyCounts] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    async function loadBoardData() {
      const data = await fetchDataFromMonday();
      setBoardData(data);

      if (data) {
        computeWeeklyCounts(data.items);
      }

      setLoading(false);
    }

    loadBoardData();
  }, []);

  const computeWeeklyCounts = (items: Item[]) => {
    const tempWeeklyCounts: number[] = [0, 0, 0, 0, 0];

    items.forEach((item) => {
      const date = parseDate(item.name);
      if (date) {
        const parsedDate = new Date(date);
        const weekIndex = Math.floor((parsedDate.getDate() - 1) / 7);
        tempWeeklyCounts[weekIndex]++;
      }
    });

    setWeeklyCounts(tempWeeklyCounts);
  };

  return (
    <CommonContext.Provider value={{ data: boardData, loading, weeklyCounts }}>
      {children}
    </CommonContext.Provider>
  );
};

export const useCommonContext = () => {
  const context = useContext(CommonContext);
  if (!context) {
    throw new Error("useMondayData must be used within a MondayDataProvider");
  }
  return context;
};

async function fetchDataFromMonday(): Promise<MondayData | null> {
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
