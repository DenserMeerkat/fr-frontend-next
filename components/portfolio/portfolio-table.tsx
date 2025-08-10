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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { usePortfolio } from "@/hooks/queries/use-portfolio";
import { Portfolio } from "@/types";
import TableHeaderComponent from "../common/data-table.tsx/table-header";
import ColumnVisibilityToggle from "../common/data-table.tsx/column-visibility";

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

const ActionsCell: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem
        onClick={() => navigator.clipboard.writeText(portfolio.stockTicker)}
      >
        Copy stock ticker
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>View stock details</DropdownMenuItem>
      <DropdownMenuItem>Buy more shares</DropdownMenuItem>
      <DropdownMenuItem>Sell shares</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

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
      <SortableHeader column={column}>Stock Ticker</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="font-mono uppercase font-medium">
        {row.getValue("stockTicker")}
      </div>
    ),
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
    header: ({ column }) => (
      <SortableHeader column={column}>Total Value</SortableHeader>
    ),
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
    accessorKey: "pricePerShare",
    header: ({ column }) => (
      <SortableHeader column={column}>Price per Share</SortableHeader>
    ),
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));
      const volume = parseInt(row.getValue("volume"));
      const pricePerShare = volume > 0 ? value / volume : 0;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(pricePerShare);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "tradeTime",
    header: ({ column }) => (
      <SortableHeader column={column}>Last Trade</SortableHeader>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("tradeTime"));
      return (
        <div className="text-sm">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell portfolio={row.original} />,
  },
];

const PortfolioDataTableSkeleton: React.FC<{ Header: React.ComponentType }> = ({
  Header,
}) => (
  <div className="w-full">
    <div className="my-4 p-4 bg-muted/50 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Value</p>
          <Skeleton className="h-8 w-24" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Holdings</p>

          <Skeleton className="h-8 w-24" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Shares</p>

          <Skeleton className="h-8 w-24" />
        </div>
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
              <TableCell>
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

  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);
  const totalShares = portfolio.reduce((sum, item) => sum + item.volume, 0);

  return (
    <div className="w-full">
      <div className="my-4 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Value</p>
            <p className="sm:text-xl md:text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalValue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Holdings</p>
            <p className="sm:text-xl md:text-2xl font-bold">
              {portfolio.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Shares</p>
            <p className="sm:text-xl md:text-2xl font-bold">
              {totalShares.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

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
  );
}
