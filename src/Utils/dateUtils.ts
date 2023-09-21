// HELPER FUNCTIONS
export const formatDate = (date: Date) =>
  `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}/${date.getFullYear()}`;

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isWeekend = (dayIndex: number): boolean => {
  return dayIndex === 0 || dayIndex === 6;
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getCurrentMonthName = (date: Date = new Date()): string => {
  return monthNames[date.getMonth()];
};

// utils/dateUtils.ts

export const getMonthlyCount = (
  items: any[],
  targetDate: Date = new Date()
): number => {
  let monthCount = 0;

  items.forEach((item: any) => {
    const date = parseDate(item.name);
    if (date) {
      const parsedDate = new Date(date);
      if (
        parsedDate.getMonth() === targetDate.getMonth() &&
        parsedDate.getFullYear() === targetDate.getFullYear()
      ) {
        monthCount++;
      }
    }
  });

  return monthCount;
};

function parseDate(dateString: string): string {
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }
  return "";
}
