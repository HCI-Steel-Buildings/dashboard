interface BreakdownDetail {
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
  linearFeet?: number;
}

interface AggregatedBreakdownDetail extends BreakdownDetail {
  count: number;
}

interface AggregatedDetails {
  [key: string]: AggregatedBreakdownDetail;
}

export type { BreakdownDetail, AggregatedBreakdownDetail, AggregatedDetails };
