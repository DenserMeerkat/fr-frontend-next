import { DEFAULT_REFETCH_INTERVAL } from "@/constants";
import { persist, createJSONStorage } from "zustand/middleware";
import { RefetchInterval } from "@/types";
import { create } from "zustand";

interface StateProps {
  refetchInterval: RefetchInterval;
  setRefetchInterval: (interval: RefetchInterval) => void;
  notifSidebarState: boolean;
  setNotifSidebarState: (open: boolean) => void;
}

export const useStateStore = create<StateProps>()(
  persist(
    (set) => ({
      refetchInterval: DEFAULT_REFETCH_INTERVAL,
      setRefetchInterval: (interval) =>
        set(() => ({
          refetchInterval: interval,
        })),
      notifSidebarState: false,
      setNotifSidebarState: (open) => {
        set(() => ({
          notifSidebarState: open,
        }));
      },
    }),
    {
      name: "zustand-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
      }),
    }
  )
);
