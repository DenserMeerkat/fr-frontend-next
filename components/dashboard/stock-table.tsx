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

const PERIOD_NUMBER = 200;

export function StockTable() {
  const [selectedGroup, setSelectedGroup] = React.useState<StockGroup>(
    stockGroupsData[0]
  );

  const selectedCompanies = selectedGroup.companies;
  const symbolsToFetch = React.useMemo(() => {
    return selectedCompanies.map((company) => company.symbol);
  }, [selectedCompanies]);

  const stockQueries = symbolsToFetch.map((symbol) =>
    usePeriodStats(symbol, PERIOD_NUMBER, !!symbol)
  );

  const tableData: StockPeriod[] = React.useMemo(() => {
    const allData: StockPeriod[] = [];
    stockQueries.forEach((query, index) => {
      if (!symbolsToFetch[index] || !query.data) {
        return;
      }

      const companyData = {
        ...query.data,
        companyName: selectedCompanies[index]?.companyName || query.data.symbol,
      };

      allData.push(companyData);
    });
    return allData;
  }, [stockQueries, selectedCompanies, symbolsToFetch]);

  const isLoading = stockQueries.some(
    (q, i) => !!symbolsToFetch[i] && q.isLoading
  );
  const hasError = stockQueries.some((q, i) => !!symbolsToFetch[i] && q.error);

  const handleGroupChange = (groupName: string) => {
    const newGroup = stockGroupsData.find(
      (group) => group.groupName === groupName
    );
    if (newGroup) {
      setSelectedGroup(newGroup);
    }
  };

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
              {tableHeads.map((head, index) => {
                return (
                  <TableHead
                    key={head}
                    className={cn("font-bold dark:font-medium")}
                  >
                    {head}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: 10 }, (i) => {
                  i;
                }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: tableHeads.length }, (i) => {
                      i;
                    }).map((_, index) => (
                      <TableCell
                        key={index}
                        colSpan={1}
                        className="text-center"
                      >
                        <Skeleton className="w-12 h-5" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : hasError ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-destructive"
                >
                  <div>Error loading data:</div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {tableData.map((stock: StockPeriod) => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-bold uppercase">
                      {stock.symbol}
                    </TableCell>
                    <TableCell className="font-medium">
                      {stock.periodNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {stock.openingPrice}
                    </TableCell>
                    <TableCell className="font-medium">
                      {stock.closingPrice}
                    </TableCell>
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
                    <TableCell className="font-medium">
                      {stock.periodStartTime}
                    </TableCell>
                    <TableCell className="font-medium">
                      {stock.periodEndTime}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
