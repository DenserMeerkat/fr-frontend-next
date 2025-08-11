"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Portfolio } from "@/types";

interface PortfolioValueChartProps {
  portfolio: Portfolio[];
}

export function PortfolioValueChart({ portfolio }: PortfolioValueChartProps) {
  const chartData = React.useMemo(() => {
    return portfolio.map((item, index) => ({
      stockTicker: item.stockTicker,
      value: item.value,
      fill: `var(--color-${item.stockTicker.toLowerCase()})`,
    }));
  }, [portfolio]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: "Portfolio Value",
      },
    };

    portfolio.forEach((item, index) => {
      config[item.stockTicker.toLowerCase()] = {
        label: item.stockTicker,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });

    return config;
  }, [portfolio]);

  const totalValue = React.useMemo(() => {
    return portfolio.reduce((acc, curr) => acc + curr.value, 0);
  }, [portfolio]);

  return (
    <div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">Investment Distribution</h3>
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                const percentage = (
                  ((data.value as number) / totalValue) *
                  100
                ).toFixed(1);
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Stock
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {data.payload.stockTicker}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Value
                        </span>
                        <span className="font-bold">
                          ${(data.value as number).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Percentage
                        </span>
                        <span className="font-bold">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="stockTicker"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-bold"
                      >
                        ${totalValue.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        Net Investment
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
