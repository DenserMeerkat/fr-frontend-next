"use client";

import { Button } from "@/components/ui/button";
import { StockPrice } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockHeaderProps {
  symbol: string;
  recentPrices: StockPrice[] | undefined;
  latestPrice: any;
  periodStats: any;
  isLoading: boolean;
}

export function StockHeader({
  symbol,
  recentPrices,
  latestPrice,
  periodStats,
  isLoading,
}: StockHeaderProps) {
  const oldPrice = recentPrices
    ? recentPrices[recentPrices.length - 1].price
    : 0;
  const priceChange = recentPrices ? recentPrices[0].price - oldPrice : 0;
  const priceChangePercent =
    periodStats && priceChange ? (priceChange / oldPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  const handleBuy = () => {
    alert(`Buy order for ${symbol?.toUpperCase()} at $${latestPrice?.price}`);
  };

  const handleSell = () => {
    alert(`Sell order for ${symbol?.toUpperCase()} at $${latestPrice?.price}`);
  };

  return (
    <div className="sticky top-12 z-50 bg-background border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col gap-1 min-w-72">
            <h1 className="text-2xl font-bold">
              {latestPrice?.companyName || symbol?.toUpperCase()}{" "}
              <span className="text-sm md:text-xl px-3 py-1 border-2 rounded-full font-normal">
                {symbol?.toUpperCase()}
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  ${latestPrice?.price?.toFixed(2) || "--"}
                </span>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-positive" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-negative" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isPositive ? "text-positive" : "text-negative"
                    }`}
                  >
                    {priceChange >= 0 ? "+" : ""}
                    {priceChangePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full lg:w-fit justify-start lg:justify-end">
            <Button
              onClick={handleBuy}
              className="bg-positive hover:bg-positive/60 px-6 sm:px-10 tracking-wider font-semibold w-1/2 lg:w-auto"
              disabled={isLoading}
            >
              BUY
            </Button>
            <Button
              onClick={handleSell}
              className="bg-negative hover:bg-negative/60 px-6 sm:px-10 tracking-wider font-semibold w-1/2 lg:w-auto"
              disabled={isLoading}
            >
              SELL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
