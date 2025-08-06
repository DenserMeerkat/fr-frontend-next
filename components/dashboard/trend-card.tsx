"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { stocksService } from "@/lib/api/services/stocks.service";
import { Skeleton } from "../ui/skeleton";
import { Area, AreaChart, YAxis } from "recharts";
import { useStateStore } from "@/hooks/use-state-store";

const chartConfig = {
  price: {
    label: "Price",
  },
};

export default function TrendCard({
  symbol = "CPGX",
  howManyValues = 20,
}: {
  symbol: string;
  howManyValues?: number;
}) {
  const { refetchInterval, setRefetchInterval } = useStateStore();
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.stocks.symbols.detail(symbol),
    queryFn: () =>
      stocksService.getNRecentStockPrices({
        symbol: symbol,
        howManyValues: howManyValues,
      }),
    refetchInterval: refetchInterval.value,
  });

  if (isLoading) {
    return <TrendCardSkeleton />;
  }

  if (error || !data?.length) {
    return (
      <Card className="text-destructive gap-0 overflow-clip p-0">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
          <CardTitle className="truncate text-xs font-medium tracking-wide">
            Error
          </CardTitle>
          <span className="min-w-12 rounded-full border px-2 py-0.5 text-center text-xs font-medium tracking-widest uppercase">
            {symbol}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div>
            <div className="px-4">
              <div className="mb-1 flex max-w-52 items-center gap-2">
                <span className="text-3xl font-bold">{error?.message}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPrice = data[data.length - 1]?.price || 0;
  const initialPrice = data[0]?.price || 0;

  const priceChange = currentPrice - initialPrice;
  const percentChange =
    initialPrice !== 0 ? (priceChange / initialPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  const chartData = data.map((item) => ({
    period: item.periodNumber,
    price: Number(item.price.toFixed(2)),
    timeStamp: item.timeStamp,
  }));

  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  const buffer = priceRange > 0 ? priceRange * 0.05 : 1;

  const chartDomain = [minPrice - buffer, maxPrice + buffer];

  return (
    <Card className="gap-0 overflow-clip p-0">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
        <CardTitle className="text-muted-foreground truncate text-xs font-medium tracking-wide">
          {data[0]?.companyName || symbol}
        </CardTitle>
        <span className="min-w-12 rounded-full border px-2 py-0.5 text-center text-xs dark:font-medium font-bold tracking-widest uppercase">
          {symbol}
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <div>
          <div className="px-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-3xl font-bold">
                ${currentPrice.toFixed(2)}
              </span>
              {isPositive ? (
                <TrendingUp
                  className="h-5 w-5"
                  style={{ color: "var(--positive-color)" }}
                />
              ) : (
                <TrendingDown
                  className="h-5 w-5"
                  style={{ color: "var(--negative-color)" }}
                />
              )}
            </div>
            <p
              className="text-sm font-medium"
              style={{
                color: isPositive
                  ? "var(--positive-color)"
                  : "var(--negative-color)",
              }}
            >
              {isPositive ? "+" : ""}
              {percentChange.toFixed(1)}% today
            </p>
          </div>

          <div className="mt-0.5 h-16">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="positiveGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--positive-color)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--positive-color)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient
                    id="negativeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--negative-color)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--negative-color)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <ChartTooltip content={<ChartTooltipContent />} />
                <YAxis domain={chartDomain} hide={true} />
                <Area
                  dataKey="price"
                  stroke={
                    isPositive
                      ? "var(--positive-color)"
                      : "var(--negative-color)"
                  }
                  strokeWidth={2.5}
                  fill={
                    isPositive
                      ? "url(#positiveGradient)"
                      : "url(#negativeGradient)"
                  }
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const TrendCardSkeleton = () => {
  return (
    <Card className="w-full max-w-md p-0">
      <CardContent className="p-0">
        <div className="space-y-4 px-4 pt-2.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="h-14 w-full" />
      </CardContent>
    </Card>
  );
};
