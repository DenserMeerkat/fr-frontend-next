import { DEFAULT_REFETCH_INTERVAL } from "@/constants";
import { RefetchInterval } from "@/types";
import { create } from "zustand";

interface StateProps {
  refetchInterval: RefetchInterval;
  setRefetchInterval: (interval: RefetchInterval) => void;
}

export const useStateStore = create<StateProps>()((set) => ({
  refetchInterval: DEFAULT_REFETCH_INTERVAL,

  setRefetchInterval: (interval) =>
    set(() => ({
      refetchInterval: interval,
    })),
}));
