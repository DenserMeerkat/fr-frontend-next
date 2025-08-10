"use client";

import * as React from "react";
import { usePeriodStats } from "@/hooks/queries";
import { StockPeriod, StockGroup } from "@/types";
import { stockGroups as stockGroupsData } from "@/constants/stocks";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

const PERIOD_NUMBER = 200;

const tableHeads: string[] = [
  "Symbol",
  "Period",
  "Opening Price",
  "Closing Price",
  "Max Price",
  "Min Price",
  "Start Time",
  "End Time",
];

function StockRow({
  symbol,
  companyName,
  onDataFetched,
}: {
  symbol: string;
  companyName: string;
  onDataFetched: (data: StockPeriod) => void;
}) {
  const {
    data: stock,
    isLoading,
    error,
  } = usePeriodStats(symbol, PERIOD_NUMBER);

  React.useEffect(() => {
    if (stock) {
      onDataFetched(stock);
    }
  }, [stock, onDataFetched]);

  if (isLoading) {
    return (
      <TableRow>
        {Array.from({ length: tableHeads.length }).map((_, index) => (
          <TableCell key={index}>
            <Skeleton className="w-12 h-5" />
          </TableCell>
        ))}
      </TableRow>
    );
  }

  if (error) {
    return null;
  }

  if (!stock) {
    return null;
  }

  return (
    <TableRow className="font-medium">
      <TableCell className="font-bold uppercase">
        <Link
          href={`/dashboard/${symbol.toLowerCase()}`}
          className="hover:underline"
        >
          {stock.symbol}
        </Link>
      </TableCell>
      <TableCell>{stock.periodNumber}</TableCell>
      <TableCell>{stock.openingPrice}</TableCell>
      <TableCell>{stock.closingPrice}</TableCell>
      <TableCell
        className="font-bold"
        style={{ color: "var(--positive-color)" }}
      >
        {stock.maxPrice}
      </TableCell>
      <TableCell
        className="font-bold"
        style={{ color: "var(--negative-color)" }}
      >
        {stock.minPrice}
      </TableCell>
      <TableCell>{stock.periodStartTime}</TableCell>
      <TableCell>{stock.periodEndTime}</TableCell>
    </TableRow>
  );
}

export function StockTable() {
  const [selectedGroup, setSelectedGroup] = React.useState<StockGroup>(
    stockGroupsData[0]
  );

  const [tableData, setTableData] = React.useState<StockPeriod[]>([]);
  const selectedCompanies = selectedGroup.companies;

  const handleDataFetched = React.useCallback((newStockData: StockPeriod) => {
    setTableData((prevData) => {
      if (!prevData.find((stock) => stock.symbol === newStockData.symbol)) {
        return [...prevData, newStockData];
      }
      return prevData;
    });
  }, []);

  const handleGroupChange = (groupName: string) => {
    const newGroup = stockGroupsData.find(
      (group) => group.groupName === groupName
    );
    if (newGroup) {
      setSelectedGroup(newGroup);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-center sm:justify-end items-center">
        <Select
          value={selectedGroup.groupName}
          onValueChange={handleGroupChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent align="end">
            {stockGroupsData.map((group) => (
              <SelectItem key={group.groupName} value={group.groupName}>
                {group.groupName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border overflow-clip">
        <Table>
          <TableCaption hidden>Stock Period Data</TableCaption>
          <TableHeader>
            <TableRow className="bg-muted">
              {tableHeads.map((head) => (
                <TableHead
                  key={head}
                  className={cn("font-bold dark:font-medium")}
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedCompanies.map((company) => (
              <StockRow
                key={company.symbol}
                symbol={company.symbol}
                companyName={company.companyName}
                onDataFetched={handleDataFetched}
              />
            ))}
          </TableBody>
          <AveragesFooter tableData={tableData} />
        </Table>
      </div>
    </div>
  );
}

export function AveragesFooter({ tableData }: { tableData: StockPeriod[] }) {
  const averages = React.useMemo(() => {
    if (tableData.length === 0) {
      return null;
    }

    const sumOpening = tableData.reduce(
      (sum, stock) => sum + (stock.openingPrice || 0),
      0
    );
    const sumClosing = tableData.reduce(
      (sum, stock) => sum + (stock.closingPrice || 0),
      0
    );
    const sumMax = tableData.reduce(
      (sum, stock) => sum + (stock.maxPrice || 0),
      0
    );
    const sumMin = tableData.reduce(
      (sum, stock) => sum + (stock.minPrice || 0),
      0
    );

    return {
      openingPrice: (sumOpening / tableData.length).toFixed(2),
      closingPrice: (sumClosing / tableData.length).toFixed(2),
      maxPrice: (sumMax / tableData.length).toFixed(2),
      minPrice: (sumMin / tableData.length).toFixed(2),
    };
  }, [tableData]);

  if (!averages) {
    return null;
  }

  return (
    <TableFooter>
      <TableRow className="font-bold">
        <TableCell colSpan={2}>Average Prices</TableCell>
        <TableCell>{averages.openingPrice}</TableCell>
        <TableCell>{averages.closingPrice}</TableCell>
        <TableCell>{averages.maxPrice}</TableCell>
        <TableCell>{averages.minPrice}</TableCell>
        <TableCell colSpan={2}></TableCell>
      </TableRow>
    </TableFooter>
  );
}
