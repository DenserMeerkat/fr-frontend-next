"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ordersService } from "@/lib/api/services/orders.service";
import { OrderType } from "@/types";
import { cn } from "@/lib/utils";

interface StockTradingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
  companyName: string;
  currentPrice: number;
  orderType: OrderType;
}

export function StockTradingModal({
  open,
  onOpenChange,
  symbol,
  companyName,
  currentPrice,
  orderType,
}: StockTradingModalProps) {
  const [volume, setVolume] = useState<string>("");

  const orderMutation = useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: (order) => {
      toast.success(`${orderType.toUpperCase()} order initiated!`, {
        description: `${order.volume} shares of ${symbol.toUpperCase()} at ${order.price.toFixed(2)}`,
        duration: 5000,
      });
      handleClose();
    },
    onError: (error) => {
      toast.error(`${orderType.toUpperCase()} order failed`, {
        description:
          orderType == OrderType.BUY
            ? "Not enough funds to buy"
            : "Not enough shares to sell",
        duration: 5000,
      });
      handleClose();
    },
  });

  const handleSubmit = () => {
    const numVolume = parseInt(volume);

    if (!numVolume || numVolume <= 0) {
      toast.error("Invalid volume", {
        description: "Please enter a valid number of shares",
      });
      return;
    }

    orderMutation.mutate({
      stockTicker: symbol,
      buyOrSell: orderType as OrderType,
      volume: numVolume,
      price: currentPrice,
    });
  };

  const handleClose = () => {
    setVolume("");
    onOpenChange(false);
  };

  const handleVolumeChange = (e: any) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);

    if (!isNaN(parsedValue)) {
      if (parsedValue >= 1 && parsedValue <= 1000) {
        setVolume(`${parsedValue}`);
      } else if (parsedValue > 1000) {
        setVolume(`${1000}`);
      } else if (parsedValue < 1) {
        setVolume(`${1}`);
      }
    } else if (value === "") {
      setVolume("");
    }
  };

  const total = volume ? parseFloat(volume) * currentPrice : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-72 sm:max-w-72 p-0">
        <DialogHeader className="p-0">
          <DialogTitle className="p-4 border-b flex items-center gap-2">
            {orderType.toUpperCase()} {symbol.toUpperCase()}
          </DialogTitle>
          <DialogDescription className="px-4 pt-2 text-sm flex flex-col items-center">
            <span>{companyName}</span>
            <span className="text-2xl font-bold mt-1">
              ${currentPrice.toFixed(2)}{" "}
              <span className="text-xl">per share</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="volume">Number of Shares</Label>
            <Input
              id="volume"
              type="number"
              placeholder="Enter volume"
              value={volume}
              onChange={handleVolumeChange}
              disabled={orderMutation.isPending}
            />
          </div>

          {total > 0 && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span>Volume:</span>
                <span className="font-medium">{volume} shares</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Price per share:</span>
                <span className="font-medium">${currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-semibold pt-2 border-t border-border/50 mt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t px-4 py-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={orderMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={
              orderMutation.isPending || !volume || parseInt(volume) <= 0
            }
            className={cn(
              "min-w-24",
              orderType === OrderType.BUY
                ? "bg-positive hover:bg-positive/90"
                : "bg-negative hover:bg-negative/90"
            )}
          >
            {orderMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {orderType.toUpperCase()} {volume && `${volume} SHARES`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
