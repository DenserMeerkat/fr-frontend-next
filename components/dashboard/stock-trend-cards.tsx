import TrendCard from "./trend-card";

const StockTrendCards = () => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <TrendCard symbol="googl" howManyValues={60} />
      <TrendCard symbol="fb" howManyValues={60} />
      <TrendCard symbol="msft" howManyValues={60} />
      <TrendCard symbol="aapl" howManyValues={60} />
    </div>
  );
};

export default StockTrendCards;
