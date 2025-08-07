import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { stocksService } from "@/lib/api/services/stocks.service";

export const useStockSymbols = () => {
  return useQuery({
    queryKey: queryKeys.stocks.symbols.list(),
    queryFn: stocksService.getSymbolList,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useStockDetails = (symbol: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.stocks.symbols.detail(symbol),
    queryFn: () => stocksService.getSymbolDetails({ symbol }),
    enabled: enabled && !!symbol,
    staleTime: 30 * 60 * 1000,
  });
};

export const useLatestStockPrice = (symbol: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.stocks.prices.latestBySymbol(symbol),
    queryFn: () => stocksService.getLatestStockPrice({ symbol }),
    enabled: enabled && !!symbol,
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
  });
};

export const useRecentStockPrices = (
  symbol: string,
  count: number = 10,
  enabled = true,
  refetchInterval?: number
) => {
  return useQuery({
    queryKey: queryKeys.stocks.prices.recentBySymbol(symbol, count),
    queryFn: () =>
      stocksService.getNRecentStockPrices({
        symbol,
        howManyValues: count,
      }),
    enabled: enabled && !!symbol && count > 0,
    staleTime: 30 * 1000,
    refetchInterval: refetchInterval,
  });
};

export const usePeriodStats = (
  symbol: string,
  periodNumber: number,
  enabled = true
) => {
  return useQuery({
    queryKey: queryKeys.stocks.periods.statsBySymbol(symbol, periodNumber),
    queryFn: () => stocksService.getPeriodStats({ symbol, periodNumber }),
    enabled: enabled && !!symbol && !!periodNumber,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStockPricesAtTime = (
  symbol: string,
  count: number,
  time: string,
  enabled = true
) => {
  return useQuery({
    queryKey: queryKeys.stocks.prices.atTimeBySymbol(symbol, count, time),
    queryFn: () =>
      stocksService.getPricesAtTime({
        symbol,
        howManyValues: count,
        whatTime: time,
      }),
    enabled: enabled && !!symbol && !!count && !!time,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
