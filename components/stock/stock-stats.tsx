"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockPeriod } from "@/types";

export function StockStats({ periodStats }: { periodStats: StockPeriod }) {
  return (
    <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t">
      <CardHeader>
        <CardTitle>Period Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Opening</p>
            <p className="text-xl font-bold">
              ${periodStats.openingPrice?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Closing</p>
            <p className="text-xl font-bold">
              ${periodStats.closingPrice?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Period High
            </p>
            <p className="text-xl font-bold">
              ${periodStats.maxPrice?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Period Low
            </p>
            <p className="text-xl font-bold">
              ${periodStats.minPrice?.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
