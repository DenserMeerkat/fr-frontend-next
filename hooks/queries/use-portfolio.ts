import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { portfolioService } from "@/lib/api/services/portfolio.service";

export const usePortfolio = () => {
  return useQuery({
    queryKey: queryKeys.portfolio.list(),
    queryFn: portfolioService.getPortfolio,
    staleTime: 1 * 60 * 1000,
  });
};

export const usePortfolioByTicker = (ticker: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.portfolio.detail(ticker),
    queryFn: () => portfolioService.getPortfolioByTicker(ticker),
    enabled: enabled && !!ticker,
    staleTime: 1 * 60 * 1000,
  });
};

export const usePortfolioSummary = () => {
  return useQuery({
    queryKey: queryKeys.portfolio.summary(),
    queryFn: portfolioService.getPortfolioSummary,
    staleTime: 30 * 1000,
  });
};
