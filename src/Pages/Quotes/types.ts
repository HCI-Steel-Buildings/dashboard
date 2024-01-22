interface BreakdownDetail {
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
  linearFeet?: number | string; // Changed from number to string
  color?: string;
}

interface AggregatedBreakdownDetail extends BreakdownDetail {
  count: number;
}

interface AggregatedDetails {
  [key: string]: AggregatedBreakdownDetail;
}
type BaseUnitCosts = {
  [key: string]: number;
};

type GutterItems = {
  [key: string]: number;
};

export type {
  BreakdownDetail,
  AggregatedBreakdownDetail,
  AggregatedDetails,
  BaseUnitCosts,
  GutterItems,
};
