import apiClient from "../api-client";

export interface IntegrationLog {
  id: number;
  action:
    | "ERP"
    | "CRM"
    | "STATUS"
    | "CREATE"
    | "UPLOAD"
    | "STATUS_CHANGE"
    | "ERP_SUCCESS"
    | "ERP_FAILURE";
  status: string;
  quote: string;
  user: string;
  payload: Record<string, any>;
  response?: Record<string, any>;
  created_at: string;
}

export const logsApi = {
  list: async (): Promise<IntegrationLog[]> => {
    const response = await apiClient.get("/api/logs/");
    return response.data;
  },

  getByQuote: async (quoteId: number): Promise<IntegrationLog[]> => {
    const response = await apiClient.get(
      `/api/logs/by_quote/?quote_id=${quoteId}`
    );
    return response.data;
  },

  getByAction: async (
    action: IntegrationLog["action"]
  ): Promise<IntegrationLog[]> => {
    const response = await apiClient.get(
      `/api/logs/by_action/?action=${action}`
    );
    return response.data;
  },
};
