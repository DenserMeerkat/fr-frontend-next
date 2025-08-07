import { StockTable } from "@/components/dashboard/stock-table";
import StockTrendCards from "@/components/dashboard/stock-trend-cards";

export default function Dashboard() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <StockTrendCards />
          <div className="px-6">
            <StockTable />
          </div>
        </div>
      </div>
    </main>
  );
}
