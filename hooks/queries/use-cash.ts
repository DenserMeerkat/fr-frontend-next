// src/hooks/use-cash.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { cashService } from "@/lib/api/services/cash.service";

export const useCashBalance = () => {
  return useQuery({
    queryKey: queryKeys.cash.detail(),
    queryFn: cashService.getCashBalance,
    staleTime: 1 * 60 * 1000,
    select: (data) => data.balance,
  });
};

export const useDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => cashService.deposit(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cash.detail() });
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => cashService.withdraw(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cash.detail() });
    },
  });
};
