import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ColumnValue,
  Item,
  MondayData,
  MondayDataContextValue,
  MondayDataProviderProps,
} from "./types";
import { parseDate } from "../Utils/dateUtils";

// Change this endpoint to point to your backend server hosted on DigitalOcean.
const BACKEND_API_ENDPOINT =
  "https://api.hcisteelbuildings.com/api/monday-data";

const MondayDataContext = createContext<MondayDataContextValue | any>({
  data: null,
  loading: true,
  weeklyCounts: [0, 0, 0, 0, 0],
});

export const MondayDataProvider: React.FC<MondayDataProviderProps> = ({
  children,
}) => {
  const [boardData, setBoardData] = useState<MondayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyCounts, setWeeklyCounts] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    async function loadBoardData() {
      const data = await fetchDataFromBackend();
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
    <MondayDataContext.Provider
      value={{ data: boardData, loading, weeklyCounts }}
    >
      {children}
    </MondayDataContext.Provider>
  );
};

export const useMondayData = () => {
  const context = useContext(MondayDataContext);
  if (!context) {
    throw new Error("useMondayData must be used within a MondayDataProvider");
  }
  return context;
};

async function fetchDataFromBackend(): Promise<MondayData | null> {
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
