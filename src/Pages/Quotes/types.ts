interface BreakdownDetail {
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
  linearFeet?: number | string; // Changed from number to string
  color?: string;
  notes?: string;
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
type ColorHexCodesType = {
  [key: string]: string; // This means each key is a string and each value is a string
};

export type {
  BreakdownDetail,
  AggregatedBreakdownDetail,
  AggregatedDetails,
  BaseUnitCosts,
  GutterItems,
  ColorHexCodesType,
};
