"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Portfolio } from "@/types";

interface PortfolioVolumeChartProps {
  portfolio: Portfolio[];
}

export function PortfolioVolumeChart({ portfolio }: PortfolioVolumeChartProps) {
  const chartData = React.useMemo(() => {
    if (!portfolio || portfolio.length === 0) {
      return [];
    }

    const sortedPortfolio = [...portfolio].sort((a, b) => b.volume - a.volume);

    const topSectors = sortedPortfolio.slice(0, 4);

    const remainingSectors = sortedPortfolio.slice(4);
    const chartDataItems = topSectors.map((item, index) => ({
      stockTicker: item.stockTicker,
      volume: item.volume,
      fill: `var(--chart-${index + 1})`,
    }));

    if (remainingSectors.length > 0) {
      const othersValue = remainingSectors.reduce(
        (acc, curr) => acc + curr.volume,
        0
      );
      chartDataItems.push({
        stockTicker: "Others",
        volume: othersValue,
        fill: `var(--chart-5)`,
      });
    }

    return chartDataItems;
  }, [portfolio]);

  const chartConfig = React.useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {};
    }

    const config: ChartConfig = {
      value: {
        label: "Portfolio Value",
      },
    };

    chartData.forEach((item) => {
      config[item.stockTicker.toLowerCase()] = {
        label: item.stockTicker.toUpperCase(),
        color: item.fill,
      };
    });

    return config;
  }, [chartData]);

  const totalVolume = React.useMemo(() => {
    return portfolio.reduce((acc, curr) => acc + curr.volume, 0);
  }, [portfolio]);

  return (
    <div className="flex flex-col sm:flex-row items-center">
      <ChartContainer
        config={chartConfig}
        className="[&_.recharts-pie-label-text]:fill-foreground h-60 w-60 md:w-64 md:h-64"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey="volume" nameKey="stockTicker" />
        </PieChart>
      </ChartContainer>
      <div className="flex flex-col items-center sm:items-start gap-2 text-sm w-full lg:w-auto">
        <h3 className="font-semibold text-lg">Stock Volume</h3>
        <div className="flex flex-col gap-1 pt-3">
          {chartData.map((item) => (
            <div key={item.stockTicker} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <div className="grid grid-cols-2 w-32">
                <span className="font-medium">
                  {item.stockTicker.toUpperCase()}
                </span>
                <span className="text-muted-foreground">{item.volume}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-muted-foreground">
              {totalVolume}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
