import apiClient from "../api-client";

export interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface CustomerCreateRequest {
  name: string;
  email: string;
}

export const crmApi = {
  createCustomer: async (
    data: CustomerCreateRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post("/api/crm/customers/", data);
    return response.data;
  },

  listCustomers: async (): Promise<Customer[]> => {
    const response = await apiClient.get("/api/crm/customers/list/");
    return response.data;
  },
};
