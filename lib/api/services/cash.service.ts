import { tradingApiClient as apiClient } from "../client";
import type { Cash } from "@/types";

export const cashService = {
  async getCashBalance(): Promise<Cash> {
    const data = await apiClient.get<Cash>("/cash");
    return data;
  },

  async deposit(amount: number): Promise<Cash> {
    const data = await apiClient.put<Cash>(`/cash/deposit?amount=${amount}`);
    return data;
  },

  async withdraw(amount: number): Promise<Cash> {
    const data = await apiClient.put<Cash>(`/cash/withdraw?amount=${amount}`);
    return data;
  },
};
