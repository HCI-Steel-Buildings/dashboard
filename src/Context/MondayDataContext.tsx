import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
interface ColumnValue {
  text: string;
  value: any;
}

interface Item {
  name: string;
  column_values: ColumnValue[];
}

interface MondayData {
  name: string;
  columns: {
    title: string;
    type: string;
  }[];
  items: Item[];
}

interface MondayDataContextValue {
  data: MondayData | null;
  loading: boolean;
  weeklyCounts: number[];
}
interface MondayDataProviderProps {
  children: ReactNode;
}

const MONDAY_API_ENDPOINT = "https://api.monday.com/v2/";
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN as string;

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

  const parseDate = (dateString: string): string => {
    // Check for MM/DD/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    return "";
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

async function fetchDataFromMonday(): Promise<MondayData | null> {
  const query = `
    query {
      boards(ids: 4803932474) {
        name
        columns {
          title
          type
        }
        items (limit: 200) {
          name
          column_values {
            text
            value
          }
        }
      }
    }
  `;

  let headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (AUTH_TOKEN) {
    headers.Authorization = AUTH_TOKEN;
  }

  try {
    const response = await fetch(MONDAY_API_ENDPOINT, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query }),
    });

    const responseBody = await response.json();
    return responseBody.data.boards[0];
  } catch (error) {
    console.error("Error fetching data from Monday.com:", error);
    return null;
  }
}
