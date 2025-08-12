"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StockHeader } from "@/components/stock/stock-header";
import { StockMetrics } from "@/components/stock/stock-metrics";
import { StockChart } from "@/components/stock/stock-chart";
import { StockStats } from "@/components/stock/stock-stats";
import {
  useLatestStockPrice,
  useRecentStockPrices,
  usePeriodStats,
} from "@/hooks/queries/use-stocks";
import { useStateStore } from "@/hooks/use-state-store";

const priceHistoryCount = 64;
const statPeriod = 200;

export default function StockDetailPage() {
  const params = useParams();
  const symbol = (params?.slug as string)?.toLowerCase();
  const { refetchInterval } = useStateStore();

  const { data: latestPrice, isLoading: priceLoading } = useLatestStockPrice(
    symbol,
    !!symbol,
    refetchInterval.value
  );
  const { data: recentPrices, isLoading: historyLoading } =
    useRecentStockPrices(
      symbol,
      priceHistoryCount,
      !!symbol,
      refetchInterval.value
    );
  const { data: periodStats, isLoading: statsLoading } = usePeriodStats(
    symbol,
    statPeriod
  );

  if (!symbol) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No stock symbol provided
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = priceLoading || historyLoading || statsLoading;

  return (
    <main>
      <div className="@container/main">
        <StockHeader
          symbol={symbol}
          recentPrices={recentPrices}
          latestPrice={latestPrice}
          periodStats={periodStats}
          isLoading={isLoading}
        />

        <div className="container mx-auto p-6 space-y-6">
          <StockMetrics
            recentPrices={recentPrices}
            latestPrice={latestPrice}
            periodStats={periodStats}
          />

          <StockChart
            recentPrices={recentPrices}
            refetchInterval={refetchInterval.value}
            isLoading={historyLoading}
          />

          {periodStats && <StockStats periodStats={periodStats} />}
        </div>
      </div>
    </main>
  );
}
