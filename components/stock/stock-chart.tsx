"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RefreshCw } from "lucide-react";
import { StockPrice } from "@/types";

interface StockChartProps {
  recentPrices: StockPrice[] | undefined;
  refetchInterval: number;
  isLoading: boolean;
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
};

export function StockChart({
  recentPrices,
  refetchInterval,
  isLoading,
}: StockChartProps) {
  const oldPrice = recentPrices
    ? recentPrices[recentPrices.length - 1].price
    : 0;
  const newPrice = recentPrices ? recentPrices[0].price : 0;
  const priceChange = recentPrices ? oldPrice - newPrice : 0;
  const isPositive = priceChange >= 0;

  const chartData =
    recentPrices?.map((price: any, index: number) => ({
      time: price.timeStamp,
      price: price.price,
      index,
    })) || [];

  const prices = chartData.map((d: any) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;
  const chartDomain = [minPrice - padding, maxPrice + padding];

  return (
    <Card className="pb-2 from-primary/5 to-card dark:bg-card bg-gradient-to-t">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Price Chart</CardTitle>
        <div className="flex items-center space-x-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <Badge variant="outline">
            Updating every {refetchInterval / 1000}s
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 pr-4 md:pr-6">
        <div className="h-[400px] w-full">
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={chartDomain} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="price"
                stroke={
                  isPositive ? "var(--positive-color)" : "var(--negative-color)"
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
      </CardContent>
    </Card>
  );
}
