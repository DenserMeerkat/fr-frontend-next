import { tradingApiClient as apiClient } from "../client";
import type {
  Order,
  CreateOrderRequest,
  OrderFilters,
  OrderType,
} from "@/types";

export const ordersService = {
  async getOrders(filters: OrderFilters = {}): Promise<Order[]> {
    const data = await apiClient.get<Order[]>("/orders", filters);
    return data || [];
  },

  async getOrderById(id: number): Promise<Order> {
    const data = await apiClient.get<Order>(`/orders/${id}`);
    return data;
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const data = await apiClient.post<Order>("/orders", orderData);
    return data;
  },

  async getOrdersByTicker(stockTicker: string): Promise<Order[]> {
    return this.getOrders({ stockTicker });
  },

  async getOrdersByType(buyOrSell: OrderType): Promise<Order[]> {
    return this.getOrders({ buyOrSell });
  },
};
