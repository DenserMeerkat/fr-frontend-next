import { tradingApiClient as apiClient } from "../client";
import type { Order, CreateOrderRequest, OrderFilters } from "@/types";

export const ordersService = {
  async getOrders(filters: OrderFilters = {}): Promise<Order[]> {
    const data = await apiClient.get<Order[]>("/orders", filters);
    return data || [];
  },

  async getOrdersByStockTicker(stockTicker: string): Promise<Order[]> {
    const data = await apiClient.get<Order[]>(`/orders/stock/${stockTicker}`);
    return data || [];
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const data = await apiClient.post<Order>("/orders", orderData);
    return data;
  },
};
