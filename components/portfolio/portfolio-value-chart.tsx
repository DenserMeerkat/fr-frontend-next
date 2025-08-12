"use client";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Portfolio } from "@/types";
import React from "react";

export const description = "A pie chart with a label";

interface PortfolioValueChartProps {
  portfolio: Portfolio[];
}

export function PortfolioValueChart({ portfolio }: PortfolioValueChartProps) {
  const chartData = React.useMemo(() => {
    if (!portfolio || portfolio.length === 0) {
      return [];
    }

    const sortedPortfolio = [...portfolio].sort((a, b) => b.value - a.value);

    const topSectors = sortedPortfolio.slice(0, 4);
    const remainingSectors = sortedPortfolio.slice(4);

    const chartDataItems = topSectors.map((item, index) => ({
      stockTicker: item.stockTicker,
      value: item.value,
      fill: `var(--chart-${index + 1})`,
    }));

    if (remainingSectors.length > 0) {
      const othersValue = remainingSectors.reduce(
        (acc, curr) => acc + curr.value,
        0
      );
      chartDataItems.push({
        stockTicker: "Others",
        value: othersValue,
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
        label: item.stockTicker,
        color: item.fill,
      };
    });

    return config;
  }, [chartData]);

  const totalValue = React.useMemo(() => {
    return portfolio.reduce((acc, curr) => acc + curr.value, 0);
  }, [portfolio]);

  return (
    <div className="flex flex-col sm:flex-row items-center">
      <ChartContainer
        config={chartConfig}
        className="[&_.recharts-pie-label-text]:fill-foreground h-60 w-60 md:w-64 md:h-64"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey="value" nameKey="stockTicker" />
        </PieChart>
      </ChartContainer>
      <div className="flex flex-col items-center sm:items-start gap-2 text-sm w-full lg:w-auto">
        <h3 className="font-semibold text-lg">Net Investment</h3>
        <div className="flex flex-col gap-1 pt-3">
          {chartData.map((item) => (
            <div key={item.stockTicker} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <div className="grid grid-cols-5 w-36">
                <span className="font-medium col-span-2">
                  {item.stockTicker.toUpperCase()}
                </span>
                <span className="text-muted-foreground col-span-3">
                  ${item.value.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-muted-foreground">
              ${totalValue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
