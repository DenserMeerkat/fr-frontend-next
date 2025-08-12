"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { usePortfolio } from "@/hooks/queries/use-portfolio";
import { Portfolio } from "@/types";
import TableHeaderComponent from "../common/data-table.tsx/table-header";
import ColumnVisibilityToggle from "../common/data-table.tsx/column-visibility";
import { PortfolioVolumeChart } from "./portfolio-volume-chart";
import { useLatestStockPrice } from "@/hooks/queries/use-stocks";
import { useStateStore } from "@/hooks/use-state-store";
import { cn } from "@/lib/utils";
import ActionsCell from "../common/data-table.tsx/actions";
import { TimeAgoCell } from "../common/data-table.tsx/time-ago";
import Link from "next/link";
import { PortfolioValueChart } from "./portfolio-value-chart";

const SKELETON_ROWS = 10;
const SKELETON_COLUMNS = 5;

const SortableHeader: React.FC<{ column: any; children: React.ReactNode }> = ({
  column,
  children,
}) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {children}
    <ArrowUpDown />
  </Button>
);

interface CurrentValueCellProps {
  stockTicker: string;
  volume: number;
  investedValue: number;
}

const CurrentValueCell: React.FC<CurrentValueCellProps> = ({
  stockTicker,
  volume,
  investedValue,
}) => {
  const { refetchInterval } = useStateStore();
  const { data, isLoading, isError } = useLatestStockPrice(
    stockTicker.toLowerCase(),
    true,
    refetchInterval.value
  );

  if (isLoading) {
    return <Skeleton className="h-6 w-24" />;
  }

  if (isError || !data || typeof data.price === "undefined") {
    return <div className="text-sm text-destructive">Error</div>;
  }

  const currentTotalValue = data.price * volume;

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(currentTotalValue);

  return (
    <div
      className={cn(
        "font-medium",
        currentTotalValue > investedValue ? "text-positive" : "text-negative"
      )}
    >
      {formatted}
    </div>
  );
};

export const columns: ColumnDef<Portfolio>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "stockTicker",
    header: ({ column }) => (
      <SortableHeader column={column}>Stock</SortableHeader>
    ),
    cell: ({ row }) => {
      const symbol = row.getValue("stockTicker") as string;
      return (
        <Link
          href={`/stock/${symbol.toLowerCase()}`}
          className="hover:underline uppercase font-medium"
        >
          {symbol}
        </Link>
      );
    },
  },
  {
    accessorKey: "volume",
    header: ({ column }) => (
      <SortableHeader column={column}>Volume</SortableHeader>
    ),
    cell: ({ row }) => {
      const volume = parseInt(row.getValue("volume"));
      return <div className="font-medium">{volume.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "value",
    header: "Net Investement",
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "currentValue",
    header: "Current Value",
    cell: ({ row }) => {
      const { stockTicker, volume, value } = row.original;
      return (
        <CurrentValueCell
          stockTicker={stockTicker}
          volume={volume}
          investedValue={value}
        />
      );
    },
  },
  {
    accessorKey: "tradeTime",
    header: ({ column }) => (
      <SortableHeader column={column}>Last Trade</SortableHeader>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("tradeTime") as string;
      return <TimeAgoCell date={createdAt} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell stockSymbol={row.original.stockTicker} />,
  },
];

const PortfolioDataTableSkeleton: React.FC<{ Header: React.ComponentType }> = ({
  Header,
}) => (
  <div className="w-full">
    <div className="p-4 flex flex-wrap gap-4 w-full justify-center">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Skeleton className="h-54 w-54 rounded-full" />
        <Skeleton className="h-48 w-40" />
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Skeleton className="h-54 w-54 rounded-full" />
        <Skeleton className="h-52 w-40" />
      </div>
    </div>
    <div className="flex items-center py-4 space-x-2">
      <Skeleton className="h-8 w-full max-w-72" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled>
          <Button variant="outline" className="ml-auto">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
    <div className="mb-4 overflow-hidden rounded-md border">
      <Table>
        <Header />
        <TableBody>
          {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
            <TableRow key={index} className="h-12">
              <TableCell>
                <Skeleton className="h-6 w-6" />
              </TableCell>
              {Array.from({ length: SKELETON_COLUMNS }).map((_, idx) => (
                <TableCell key={idx}>
                  <Skeleton className="h-6 w-12" />
                </TableCell>
              ))}
              <TableCell className="flex gap-1">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export function PortfolioDataTable() {
  const { data: portfolio = [], isLoading, error } = usePortfolio();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: portfolio,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const HeaderComponent = () => <TableHeaderComponent table={table} />;

  if (isLoading) {
    return <PortfolioDataTableSkeleton Header={HeaderComponent} />;
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-negative">Error loading portfolio</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-col">
      <div className="p-4 flex flex-wrap gap-4 w-full justify-center">
        <PortfolioValueChart portfolio={portfolio} />
        <PortfolioVolumeChart portfolio={portfolio} />
      </div>

      <div>
        <div className="flex items-center py-4 space-x-2">
          <Input
            placeholder="Filter by stock ticker..."
            value={
              (table.getColumn("stockTicker")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("stockTicker")?.setFilterValue(event.target.value)
            }
            className="max-w-72"
          />
          <ColumnVisibilityToggle table={table} />
        </div>

        <div className="mb-4 overflow-hidden rounded-md border">
          <Table>
            <HeaderComponent />
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No portfolio items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
