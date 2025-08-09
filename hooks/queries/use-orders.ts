import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { ordersService } from "@/lib/api/services/orders.service";
import { CreateOrderRequest, OrderFilters, OrderType } from "@/types";

export const useOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => ordersService.getOrders(filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrder = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersService.getOrderById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrdersByTicker = (ticker: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.orders.byTicker(ticker),
    queryFn: () => ordersService.getOrdersByTicker(ticker),
    enabled: enabled && !!ticker,
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrdersByType = (type: OrderType, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.orders.byType(type),
    queryFn: () => ordersService.getOrdersByType(type),
    enabled: enabled && !!type,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      ordersService.createOrder(orderData),
    onSuccess: (newOrder, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.all });

      queryClient.setQueryData(
        queryKeys.orders.list({}),
        (oldOrders: any[]) => {
          if (!oldOrders) return [newOrder];
          return [...oldOrders, newOrder];
        }
      );

      if (variables.stockTicker) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.byTicker(variables.stockTicker),
        });
      }
    },
    onError: (error) => {
      console.error("Failed to create order:", error);
    },
  });
};
