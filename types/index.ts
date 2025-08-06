export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const RefetchIntervals = {
  ONE_SECOND: { label: "1 second", value: 1000 },
  FIVE_SECONDS: { label: "5 seconds", value: 5000 },
  TEN_SECONDS: { label: "10 seconds", value: 10000 },
  ONE_MINUTE: { label: "1 minute", value: 60000 },
  FIVE_MINUTES: { label: "5 minutes", value: 300000 },
} as const;

export type RefetchInterval =
  (typeof RefetchIntervals)[keyof typeof RefetchIntervals];

export enum OrderType {
  BUY = "BUY",
  SELL = "SELL",
}

export interface Order {
  id: number;
  stockTicker: string;
  price: number;
  volume: number;
  buyOrSell: OrderType;
  statusCode: number;
  createdAt: Date;
}

export interface Portfolio {
  stockTicker: string;
  value: number;
  volume: number;
  tradeTime: Date;
}

export interface StockSymbol {
  companyName: string;
  symbol: string;
  symbolId: number;
}

export interface StockPrice {
  companyName: string;
  symbol: string;
  price: number;
  periodNumber: number;
  timeStamp: Date;
}

export interface StockPeriod {
  symbol: string;
  symbolId: number;
  openingPrice: number;
  closingPrice: number;
  maxPrice: number;
  minPrice: number;
  periodStartTime: Date;
  periodEndTime: Date;
  periodNumber: number;
}

export interface CreateOrderRequest {
  stockTicker: string;
  price: number;
  volume: number;
  buyOrSell: OrderType;
}

export interface OrderFilters {
  stockTicker?: string;
  buyOrSell?: OrderType;
  statusCode?: number;
  page?: number;
  limit?: number;
}

export interface StockFilters {
  symbol?: string;
  periodNumber?: number;
  howManyValues?: number;
  whatTime?: string;
}
