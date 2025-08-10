import React, { useState } from "react";
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
import {
  InputBase,
  InputBaseAdornment,
  InputBaseControl,
  InputBaseInput,
} from "@/components/ui/input-base";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useCashBalance,
  useDeposit,
  useWithdraw,
} from "@/hooks/queries/use-cash";

const BalanceModal = ({ onClose }: { onClose: () => void }) => {
  const [amount, setAmount] = useState<string>("");

  const { data: currentBalance, isLoading: isBalanceLoading } =
    useCashBalance();
  const depositMutation = useDeposit();
  const withdrawMutation = useWithdraw();

  const handleSuccess = (message: string) => {
    toast.success(message);
    onClose();
  };

  const handleError = (error: Error, defaultMessage: string) => {
    const message = error.message || defaultMessage;
    toast.error(message);
    onClose();
  };

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0 || isNaN(depositAmount)) {
      toast.error("Please enter a valid amount to deposit.");
      return;
    }
    depositMutation.mutate(depositAmount, {
      onSuccess: () => handleSuccess("Deposit successful!"),
      onError: (error) => handleError(error, "Failed to deposit funds."),
    });
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0 || isNaN(withdrawAmount)) {
      toast.error("Please enter a valid amount to withdraw.");
      return;
    }
    if (currentBalance === undefined || withdrawAmount > currentBalance) {
      toast.error("Insufficient balance for this withdrawal.");
      return;
    }
    withdrawMutation.mutate(withdrawAmount, {
      onSuccess: () => handleSuccess("Withdrawal successful!"),
      onError: (error) => handleError(error, "Failed to withdraw funds."),
    });
  };

  const isMutating = depositMutation.isPending || withdrawMutation.isPending;
  const isLoading = isMutating || isBalanceLoading;

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
    >
      <DialogContent className="max-w-72 sm:max-w-72 p-0">
        <DialogHeader className="p-0">
          <DialogTitle className="p-4 border-b">Manage Balance</DialogTitle>
          <div className="px-4 pt-4 text-center">
            <DialogDescription className="text-sm">
              Current Balance:
            </DialogDescription>
            <div className="mt-2 text-4xl font-bold text-foreground">
              {isBalanceLoading
                ? "Loading..."
                : `$${currentBalance?.toFixed(2) ?? "0.00"}`}
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4 px-4">
            <Label htmlFor="amount" className="">
              Amount
            </Label>
            <InputBase className="font-bold text-2xl md:text-3xl h-12">
              <InputBaseAdornment className="">$</InputBaseAdornment>
              <InputBaseControl>
                <InputBaseInput
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </InputBaseControl>
            </InputBase>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-col-reverse sm:justify-between border-t px-4 py-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isLoading}>
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleWithdraw}
            disabled={isLoading || !currentBalance}
            variant="outline"
            className="w-full"
          >
            {isMutating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Withdraw"
            )}
          </Button>
          <Button
            type="button"
            onClick={handleDeposit}
            disabled={isMutating}
            className="w-full"
          >
            {isMutating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Deposit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BalanceModal;
