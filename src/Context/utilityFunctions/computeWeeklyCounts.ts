import { parseDate } from "../../Utils/dateUtils";

export function computeWeeklyCounts(items: any) {
  const tempWeeklyCounts = [0, 0, 0, 0, 0];

  items.forEach((item: any) => {
    const date = parseDate(item.name);
    if (date) {
      const parsedDate = new Date(date);
      const weekIndex = Math.floor((parsedDate.getDate() - 1) / 7);
      tempWeeklyCounts[weekIndex]++;
    }
  });

  return tempWeeklyCounts;
}
