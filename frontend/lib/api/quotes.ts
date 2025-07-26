import apiClient from "../api-client";

export interface Quote {
  id: number;
  opportunity_id: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Converted";
  supporting_document?: string;
  created_at: string;
  updated_at: string;
  submitted_by: number;
}

export interface QuoteCreateRequest {
  opportunity_id: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  supporting_document?: File;
}

export interface SetStatusRequest {
  status: Quote["status"];
}

export const quotesApi = {
  list: async (): Promise<Quote[]> => {
    const response = await apiClient.get("/api/quotes/");
    return response.data;
  },

  create: async (data: QuoteCreateRequest): Promise<Quote> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await apiClient.post("/api/quotes/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  get: async (id: number): Promise<Quote> => {
    const response = await apiClient.get(`/api/quotes/${id}/`);
    return response.data;
  },

  setStatus: async (id: number, data: SetStatusRequest): Promise<Quote> => {
    const response = await apiClient.post(
      `/api/quotes/${id}/set_status/`,
      data
    );
    return response.data;
  },

  uploadFile: async (id: number, file: File): Promise<Quote> => {
    const formData = new FormData();
    formData.append("supporting_document", file);

    const response = await apiClient.post(
      `/api/quotes/${id}/upload_file/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
};
