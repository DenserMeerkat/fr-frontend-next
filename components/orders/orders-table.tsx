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
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useOrders } from "@/hooks/queries/use-orders";
import { Order, OrderType } from "@/types";
import TableHeaderComponent from "../common/data-table.tsx/table-header";
import ColumnVisibilityToggle from "../common/data-table.tsx/column-visibility";
import { TimeAgoCell } from "../common/data-table.tsx/time-ago";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import ActionsCell from "../common/data-table.tsx/actions";

const ALL_FILTER = "all";
const SKELETON_ROWS = 10;
const SKELETON_COLUMNS = 7;

const getStatusText = (statusCode: number): string => {
  const statusMap: Record<number, string> = {
    0: "pending",
    1: "processing",
    2: "success",
    3: "failed",
  };
  return statusMap[statusCode] ?? "pending";
};

const getStatusColor = (statusCode: number): string => {
  const colorMap: Record<number, string> = {
    0: "text-yellow-600",
    1: "text-blue-600",
    2: "text-green-600",
    3: "text-red-600",
  };
  return colorMap[statusCode] ?? "text-gray-600";
};

const exactMatchFilter = (
  row: any,
  columnId: string,
  filterValue: string
): boolean => {
  if (filterValue === ALL_FILTER || filterValue === undefined) {
    return true;
  }
  return row.getValue(columnId) === Number(filterValue);
};

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

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <SortableHeader column={column}>Order ID</SortableHeader>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
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
    accessorKey: "buyOrSell",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("buyOrSell") as OrderType;
      const colorClass = type === "BUY" ? "text-positive" : "text-negative";

      return (
        <div
          className={`capitalize font-semibold dark:font-medium ${colorClass}`}
        >
          {type}
        </div>
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
    accessorKey: "price",
    header: ({ column }) => (
      <SortableHeader column={column}>Price</SortableHeader>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusCode",
    header: "Status",
    filterFn: exactMatchFilter,
    cell: ({ row }) => {
      const statusCode = row.getValue("statusCode") as number;
      const statusText = getStatusText(statusCode);
      const statusColor = getStatusColor(statusCode);

      return (
        <div
          className={`capitalize font-semibold dark:font-medium ${statusColor}`}
        >
          {statusText}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Order Placed</SortableHeader>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <TimeAgoCell date={createdAt} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell stockSymbol={row.original.stockTicker} />,
  },
];

const OrdersDataTableSkeleton: React.FC<{ Header: React.ComponentType }> = ({
  Header,
}) => (
  <div className="w-full">
    <div className="flex items-center py-4 space-x-2">
      <Skeleton className="h-8 w-full max-w-72" />
      <Skeleton className="h-8 w-full max-w-36" />
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

const StatusFilter: React.FC<{ table: any }> = ({ table }) => (
  <Select
    value={(table.getColumn("statusCode")?.getFilterValue() as string) ?? ""}
    onValueChange={(value) =>
      table.getColumn("statusCode")?.setFilterValue(value)
    }
    defaultValue={ALL_FILTER}
  >
    <SelectTrigger className="w-[140px]">
      <SelectValue placeholder="Status" className="capitalize" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value={ALL_FILTER} className="capitalize">
          {ALL_FILTER}
        </SelectItem>
        {Array.from({ length: 4 }).map((_, index) => (
          <SelectItem key={index} value={`${index}`} className="capitalize">
            {getStatusText(index)}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

interface OrdersDataTableProps {
  filters?: any;
}

export function OrdersDataTable({ filters = {} }: OrdersDataTableProps) {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useOrders({ filters: filters, refetchInterval: 1000 });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const memoizedData = React.useMemo(() => orders, [orders]);

  const table = useReactTable({
    data: memoizedData,
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
    return <OrdersDataTableSkeleton Header={HeaderComponent} />;
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-negative">Error loading orders</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
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
        <StatusFilter table={table} />
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
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
