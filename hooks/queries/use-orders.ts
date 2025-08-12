import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { ordersService } from "@/lib/api/services/orders.service";
import { CreateOrderRequest, OrderFilters } from "@/types";

export const useOrders = ({
  filters,
  refetchInterval,
}: {
  filters: OrderFilters;
  refetchInterval?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => ordersService.getOrders(filters),
    refetchInterval: refetchInterval,
  });
};

export const useOrdersByTicker = (ticker: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.orders.byTicker(ticker),
    queryFn: () => ordersService.getOrdersByStockTicker(ticker),
    enabled: enabled && !!ticker,
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
