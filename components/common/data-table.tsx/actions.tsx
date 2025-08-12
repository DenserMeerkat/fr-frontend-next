"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Eye, MoreHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ActionsCellProps {
  stockSymbol: string;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ stockSymbol }) => {
  const copyToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success("Stock symbol copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy stock symbol.");
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="flex w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/stock/${stockSymbol.toLowerCase()}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>View stock details</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/stock/${stockSymbol.toLowerCase()}?action=buy`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <TrendingUp className="h-4 w-4 text-positive" />
            <span className="sr-only">Buy Shares</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Buy shares</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/stock/${stockSymbol.toLowerCase()}?action=sell`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <TrendingDown className="h-4 w-4 text-negative" />
            <span className="sr-only">Sell Shares</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sell shares</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <Link href={`/stock/${stockSymbol.toLowerCase()}`}>
            <DropdownMenuItem>View stock details</DropdownMenuItem>
          </Link>

          <Link href={`/stock/${stockSymbol.toLowerCase()}?action=buy`}>
            <DropdownMenuItem>Buy shares</DropdownMenuItem>
          </Link>

          <Link href={`/stock/${stockSymbol.toLowerCase()}?action=sell`}>
            <DropdownMenuItem>Sell shares</DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => copyToClipboard(stockSymbol.toUpperCase())}
          >
            Copy stock symbol
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionsCell;
