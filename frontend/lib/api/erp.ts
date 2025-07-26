import apiClient from "../api-client";

export interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderCreateRequest {
  customer: string;
  total: number;
  status: string;
}

export const erpApi = {
  createOrder: async (
    data: OrderCreateRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post("/api/erp/orders/", data);
    return response.data;
  },

  listOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get("/api/erp/orders/list/");
    return response.data;
  },
};
