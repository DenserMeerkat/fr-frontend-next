import { stockApiClient as apiClient } from "../client";
import type {
  StockSymbol,
  StockPrice,
  StockPeriod,
  StockFilters,
} from "@/types";

export const stocksService = {
  async getSymbolList(): Promise<StockSymbol[]> {
    const data = await apiClient.get<StockSymbol[]>("/StockFeed/GetSymbolList");
    return data;
  },

  async getSymbolDetails(
    filters: Pick<StockFilters, "symbol">
  ): Promise<StockSymbol> {
    if (!filters.symbol) {
      throw new Error("Symbol is required to get symbol details.");
    }
    const data = await apiClient.get<StockSymbol[]>(
      `/StockFeed/GetSymbolDetails/${filters.symbol}`
    );
    if (data.length === 0) {
      throw new Error(`No details found for ticker: ${filters.symbol}`);
    }
    return data[0]!;
  },

  async getLatestStockPrice(
    filters: Pick<StockFilters, "symbol">
  ): Promise<StockPrice> {
    if (!filters.symbol) {
      throw new Error("Symbol is required to get the latest price.");
    }
    const data = await apiClient.get<StockPrice[]>(
      `/StockFeed/GetStockPricesForSymbol/${filters.symbol}`
    );
    if (data.length === 0) {
      throw new Error(`No price data found for ticker: ${filters.symbol}`);
    }
    return data[0]!;
  },

  async getNRecentStockPrices(
    filters: Pick<StockFilters, "symbol" | "howManyValues">
  ): Promise<StockPrice[]> {
    if (!filters.symbol || !filters.howManyValues) {
      throw new Error(
        "Symbol and howManyValues are required to get recent prices."
      );
    }
    const data = await apiClient.get<StockPrice[]>(
      `/StockFeed/GetStockPricesForSymbol/${filters.symbol}`,
      { HowManyValues: filters.howManyValues }
    );
    return data;
  },

  async getPeriodStats(
    filters: Pick<StockFilters, "symbol" | "periodNumber">
  ): Promise<StockPeriod> {
    if (!filters.symbol || !filters.periodNumber) {
      throw new Error(
        "Symbol and periodNumber are required to get period stats."
      );
    }
    const data = await apiClient.get<StockPeriod[]>(
      `/StockFeed/GetOpenCloseMinMaxForSymbolAndPeriodNumber/${filters.symbol}`,
      { PeriodNumber: filters.periodNumber }
    );
    if (data.length === 0) {
      throw new Error(
        `No period data found for ticker: ${filters.symbol} and period: ${filters.periodNumber}`
      );
    }
    return data[0]!;
  },

  async getPricesAtTime(
    filters: Pick<StockFilters, "symbol" | "howManyValues" | "whatTime">
  ): Promise<StockPrice[]> {
    if (!filters.symbol || !filters.howManyValues || !filters.whatTime) {
      throw new Error(
        "Symbol, howManyValues, and whatTime are required to get prices at a specific time."
      );
    }
    const data = await apiClient.get<StockPrice[]>(
      `/StockFeed/GetStockPricesForSymbol/${filters.symbol}`,
      { HowManyValues: filters.howManyValues, WhatTime: filters.whatTime }
    );
    return data;
  },
};
