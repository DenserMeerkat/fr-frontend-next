import { OrderFilters, OrderType } from "@/types";

export const queryKeys = {
  // Cash domain
  cash: {
    // Base key for all cash queries
    all: ["cash"] as const,

    // Detail queries
    details: () => [...queryKeys.cash.all, "detail"] as const,
    detail: () => [...queryKeys.cash.details(), "balance"] as const,
  },

  // Orders domain
  orders: {
    // Base key for all order queries
    all: ["orders"] as const,

    // List queries
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters: OrderFilters) =>
      [...queryKeys.orders.lists(), filters] as const,

    // Detail queries
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.orders.details(), id] as const,

    // Filtered queries
    byTicker: (ticker: string) =>
      [...queryKeys.orders.lists(), { stockTicker: ticker }] as const,
    byType: (type: OrderType) =>
      [...queryKeys.orders.lists(), { buyOrSell: type }] as const,
  },

  // Portfolio domain
  portfolio: {
    // Base key for all portfolio queries
    all: ["portfolio"] as const,

    // List queries
    lists: () => [...queryKeys.portfolio.all, "list"] as const,
    list: () => [...queryKeys.portfolio.lists()] as const,

    // Detail queries
    details: () => [...queryKeys.portfolio.all, "detail"] as const,
    detail: (ticker: string) =>
      [...queryKeys.portfolio.details(), ticker] as const,

    // Summary queries
    summaries: () => [...queryKeys.portfolio.all, "summary"] as const,
    summary: () => [...queryKeys.portfolio.summaries()] as const,
  },

  // Stocks domain
  stocks: {
    // Base key for all stock queries
    all: ["stocks"] as const,

    // Symbol list queries
    symbols: {
      all: () => [...queryKeys.stocks.all, "symbols"] as const,
      list: () => [...queryKeys.stocks.symbols.all(), "list"] as const,
      details: () => [...queryKeys.stocks.symbols.all(), "details"] as const,
      detail: (symbol: string) =>
        [...queryKeys.stocks.symbols.details(), symbol] as const,
    },

    // Price queries
    prices: {
      all: () => [...queryKeys.stocks.all, "prices"] as const,

      // Latest price
      latest: () => [...queryKeys.stocks.prices.all(), "latest"] as const,
      latestBySymbol: (symbol: string) =>
        [...queryKeys.stocks.prices.latest(), symbol] as const,

      // Recent prices
      recent: () => [...queryKeys.stocks.prices.all(), "recent"] as const,
      recentBySymbol: (symbol: string, count: number) =>
        [...queryKeys.stocks.prices.recent(), symbol, count] as const,

      // Prices at specific time
      atTime: () => [...queryKeys.stocks.prices.all(), "at-time"] as const,
      atTimeBySymbol: (symbol: string, count: number, time: string) =>
        [...queryKeys.stocks.prices.atTime(), symbol, count, time] as const,
    },

    // Period stats queries
    periods: {
      all: () => [...queryKeys.stocks.all, "periods"] as const,
      stats: () => [...queryKeys.stocks.periods.all(), "stats"] as const,
      statsBySymbol: (symbol: string, periodNumber: number) =>
        [...queryKeys.stocks.periods.stats(), symbol, periodNumber] as const,
    },
  },
} as const;

/**
 * Helper functions for common query key patterns
 */
export const queryKeyHelpers = {
  /**
   * Get all order-related query keys for invalidation
   */
  getAllOrderKeys: () => queryKeys.orders.all,

  /**
   * Get all portfolio-related query keys for invalidation
   */
  getAllPortfolioKeys: () => queryKeys.portfolio.all,

  /**
   * Get all stock-related query keys for invalidation
   */
  getAllStockKeys: () => queryKeys.stocks.all,

  /**
   * Get all price-related query keys for a specific symbol
   */
  getAllPriceKeysForSymbol: (symbol: string) =>
    [queryKeys.stocks.prices.all(), symbol] as const,

  /**
   * Get all query keys for a specific symbol (prices, details, etc.)
   */
  getAllKeysForSymbol: (symbol: string) =>
    [queryKeys.stocks.all, symbol] as const,
};

export type QueryKeys = typeof queryKeys;
export type OrderQueryKeys = typeof queryKeys.orders;
export type PortfolioQueryKeys = typeof queryKeys.portfolio;
export type StockQueryKeys = typeof queryKeys.stocks;
