import Link from "next/link";
import TrendCard from "./trend-card";

const StockTrendCards = () => {
  const symbols: string[] = ["googl", "fb", "msft", "aapl"];
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {symbols.map((symbol) => {
        return (
          <Link key={symbol} href={`/stock/${symbol}`}>
            <TrendCard symbol={symbol} howManyValues={60} />
          </Link>
        );
      })}
    </div>
  );
};

export default StockTrendCards;
