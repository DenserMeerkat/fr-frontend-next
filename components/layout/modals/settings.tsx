import React from "react";
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
import { Separator } from "@/components/ui/separator";
import { useStateStore } from "@/hooks/use-state-store";
import { cn } from "@/lib/utils";
import { RefetchInterval, RefetchIntervals } from "@/types";
import { toast } from "sonner";
import { DEFAULT_REFETCH_INTERVAL } from "@/constants";

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { refetchInterval, setRefetchInterval } = useStateStore();

  const setInterval = (interval: RefetchInterval) => {
    setRefetchInterval(interval);
    toast.success(`Refetch interval set to ${interval.label}`);
    onClose();
  };

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
          <DialogTitle className="p-4 border-b">Settings</DialogTitle>
          <DialogDescription className="px-4 pt-2 text-sm">
            Choose how often the Live Price data should refresh.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 py-2">
          <div className="grid mx-auto w-60 rounded-md overflow-hidden border">
            {Object.values(RefetchIntervals).map((interval, index) => (
              <React.Fragment key={interval.value}>
                <Button
                  variant={
                    refetchInterval.value === interval.value
                      ? "default"
                      : "ghost"
                  }
                  className={cn("rounded-none w-full")}
                  onClick={() => setInterval(interval)}
                >
                  {interval.label}
                </Button>
                {index < Object.values(RefetchIntervals).length - 1 && (
                  <Separator className="" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <DialogFooter className="border-t px-4 py-2">
          <Button
            disabled={refetchInterval == DEFAULT_REFETCH_INTERVAL}
            variant="outline"
            onClick={() => setInterval(DEFAULT_REFETCH_INTERVAL)}
          >
            Reset
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
