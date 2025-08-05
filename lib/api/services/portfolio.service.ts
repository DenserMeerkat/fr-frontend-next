import { tradingApiClient as apiClient } from "../client";
import type { Portfolio, ApiResponse } from "@/types";

export const portfolioService = {
  async getPortfolio(): Promise<Portfolio[]> {
    const response =
      await apiClient.get<ApiResponse<Portfolio[]>>("/portfolio");
    return response.data;
  },

  async getPortfolioByTicker(stockTicker: string): Promise<Portfolio | null> {
    const portfolio = await this.getPortfolio();
    return portfolio.find((item) => item.stockTicker === stockTicker) || null;
  },

  async getPortfolioSummary(): Promise<{
    totalValue: number;
    totalStocks: number;
    topHoldings: Portfolio[];
  }> {
    const portfolio = await this.getPortfolio();

    const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);
    const totalStocks = portfolio.length;
    const topHoldings = portfolio.sort((a, b) => b.value - a.value).slice(0, 5);

    return {
      totalValue,
      totalStocks,
      topHoldings,
    };
  },
};
