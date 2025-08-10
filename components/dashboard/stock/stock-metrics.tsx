"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { StockPeriod, StockPrice } from "@/types";

interface StockMetricsProps {
  recentPrices: StockPrice[] | undefined;
  latestPrice: StockPrice | undefined;
  periodStats: StockPeriod | undefined;
}

export function StockMetrics({
  recentPrices,
  latestPrice,
  periodStats,
}: StockMetricsProps) {
  const oldPrice = recentPrices
    ? recentPrices[recentPrices.length - 1].price
    : 0;
  const priceChange = recentPrices ? recentPrices[0].price - oldPrice : 0;
  const priceChangePercent =
    periodStats && priceChange ? (priceChange / oldPrice) * 100 : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-medium">Current Price</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            ${latestPrice?.price?.toFixed(2) || "--"}
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{latestPrice?.timeStamp || "--"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-medium">Change</CardTitle>
          {priceChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-positive" />
          ) : (
            <TrendingDown className="h-4 w-4 text-negative" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-4xl font-bold ${
              priceChange >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}
          </div>
          <p
            className={`text-xs ${
              priceChange >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {priceChange >= 0 ? "+" : ""}
            {priceChangePercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-medium">Day High</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            ${periodStats?.maxPrice?.toFixed(2) || "--"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-medium">Day Low</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            ${periodStats?.minPrice?.toFixed(2) || "--"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
