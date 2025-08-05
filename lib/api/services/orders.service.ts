import { tradingApiClient as apiClient } from "../client";
import type {
  Order,
  CreateOrderRequest,
  OrderFilters,
  ApiResponse,
  OrderType,
} from "@/types";

export const ordersService = {
  async getOrders(filters: OrderFilters = {}): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      "/orders",
      filters
    );
    return response.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(
      "/orders",
      orderData
    );
    return response.data;
  },

  async getOrdersByTicker(stockTicker: string): Promise<Order[]> {
    return this.getOrders({ stockTicker });
  },

  async getOrdersByType(buyOrSell: OrderType): Promise<Order[]> {
    return this.getOrders({ buyOrSell });
  },
};
