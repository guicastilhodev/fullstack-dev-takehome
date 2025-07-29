import {
  Configuration,
  AuthApi,
  QuotesApi,
  UserApi,
  LogsApi,
  CrmApi,
  ErpApi,
} from "../../api-client";
import { QuotesSetStatusRequestStatusEnum } from "../../api-client/models";
import apiClient from "../api-client";

const configuration = new Configuration({
  basePath:
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api",
  credentials: "include",
  middleware: [
    {
      pre: async (context) => {
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];

        if (csrfToken && context.init.headers) {
          (context.init.headers as any)["X-CSRFToken"] = csrfToken;
        }
        return context;
      },
    },
  ],
});

export const authApi = new AuthApi(configuration);
export const quotesApi = new QuotesApi(configuration);
export const userApi = new UserApi(configuration);
export const logsApi = new LogsApi(configuration);
export const crmApi = new CrmApi(configuration);
export const erpApi = new ErpApi(configuration);

export * from "../../api-client/models";

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  first_name: string;
  last_name: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Quote {
  id: number;
  opportunity_id: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Converted to Order";
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

export interface IntegrationLog {
  id: number;
  user: string;
  quote: string;
  action: string;
  status: string;
  payload: any;
  response: any;
  created_at: string;
}

export const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    window.location.href = "/login";
  }
  throw error;
};

// Helper function to map backend status to frontend status
const mapBackendStatusToFrontend = (
  backendStatus: any
): "Pending Review" | "Approved" | "Rejected" | "Converted to Order" => {
  switch (backendStatus) {
    case "Pending Review":
      return "Pending Review";
    case "Approved":
      return "Approved";
    case "Rejected":
      return "Rejected";
    case "Converted":
      return "Converted to Order";
    default:
      return "Pending Review";
  }
};

export const quotesApiCompat = {
  list: async (): Promise<Quote[]> => {
    try {
      const result = await quotesApi.quotesList();
      return result.map((quote) => ({
        id: quote.id || 0,
        opportunity_id: quote.opportunityId,
        customer_name: quote.customerName,
        customer_email: quote.customerEmail,
        customer_company: quote.customerCompany,
        status: mapBackendStatusToFrontend(quote.status),
        supporting_document: quote.supportingDocument || undefined,
        created_at: quote.createdAt?.toISOString() || "",
        updated_at: quote.updatedAt?.toISOString() || "",
        submitted_by: quote.submittedBy || 0,
      }));
    } catch (error) {
      return handleApiError(error);
    }
  },

  create: async (data: QuoteCreateRequest): Promise<Quote> => {
    try {
      const result = await quotesApi.quotesCreate({
        opportunityId: data.opportunity_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerCompany: data.customer_company,
        supportingDocument: data.supporting_document,
      });
      return {
        id: result.id || 0,
        opportunity_id: result.opportunityId,
        customer_name: result.customerName,
        customer_email: result.customerEmail,
        customer_company: result.customerCompany,
        status: mapBackendStatusToFrontend(result.status),
        supporting_document: result.supportingDocument || undefined,
        created_at: result.createdAt?.toISOString() || "",
        updated_at: result.updatedAt?.toISOString() || "",
        submitted_by: result.submittedBy || 0,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  get: async (id: number): Promise<Quote> => {
    try {
      const result = await quotesApi.quotesRead({ id: id.toString() });
      return {
        id: result.id || 0,
        opportunity_id: result.opportunityId,
        customer_name: result.customerName,
        customer_email: result.customerEmail,
        customer_company: result.customerCompany,
        status: mapBackendStatusToFrontend(result.status),
        supporting_document: result.supportingDocument || undefined,
        created_at: result.createdAt?.toISOString() || "",
        updated_at: result.updatedAt?.toISOString() || "",
        submitted_by: result.submittedBy || 0,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  setStatus: async (id: number, data: { status: string }): Promise<Quote> => {
    try {
      let statusEnum: QuotesSetStatusRequestStatusEnum;
      switch (data.status) {
        case "Pending Review":
          statusEnum = QuotesSetStatusRequestStatusEnum.PendingReview;
          break;
        case "Approved":
          statusEnum = QuotesSetStatusRequestStatusEnum.Approved;
          break;
        case "Rejected":
          statusEnum = QuotesSetStatusRequestStatusEnum.Rejected;
          break;
        case "Converted to Order":
          statusEnum = "Converted" as QuotesSetStatusRequestStatusEnum;
          break;
        default:
          statusEnum = QuotesSetStatusRequestStatusEnum.PendingReview;
      }

      const result = await quotesApi.quotesSetStatus({
        id: id.toString(),
        data: { status: statusEnum },
      });

      return {
        id: result.id || 0,
        opportunity_id: result.opportunityId,
        customer_name: result.customerName,
        customer_email: result.customerEmail,
        customer_company: result.customerCompany,
        status: mapBackendStatusToFrontend(result.status),
        supporting_document: result.supportingDocument || undefined,
        created_at: result.createdAt?.toISOString() || "",
        updated_at: result.updatedAt?.toISOString() || "",
        submitted_by: result.submittedBy || 0,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  uploadFile: async (id: number, file: File): Promise<Quote> => {
    try {
      const result = await quotesApi.quotesUploadFile({
        id: id.toString(),
        supportingDocument: file,
      });
      return {
        id: result.id || 0,
        opportunity_id: result.opportunityId,
        customer_name: result.customerName,
        customer_email: result.customerEmail,
        customer_company: result.customerCompany,
        status: mapBackendStatusToFrontend(result.status),
        supporting_document: result.supportingDocument || undefined,
        created_at: result.createdAt?.toISOString() || "",
        updated_at: result.updatedAt?.toISOString() || "",
        submitted_by: result.submittedBy || 0,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export const authApiCompat = {
  login: async (data: { username: string; password: string }) => {
    try {
      return await authApi.loginCreate({ data });
    } catch (error) {
      return handleApiError(error);
    }
  },

  register: async (data: {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
  }) => {
    try {
      return await authApi.registerCreate({ data });
    } catch (error) {
      return handleApiError(error);
    }
  },

  logout: async () => {
    try {
      return await authApi.logoutCreate();
    } catch (error) {
      return handleApiError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/api/user/");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export const logsApiCompat = {
  list: async (): Promise<IntegrationLog[]> => {
    try {
      const result = await logsApi.logsList();
      return result.map((log) => ({
        id: log.id || 0,
        user: log.user || "",
        quote: log.quote || "",
        action: log.action,
        payload: log.payload,
        response: log.response,
        status: log.status,
        created_at: log.createdAt?.toISOString() || "",
      }));
    } catch (error) {
      return handleApiError(error);
    }
  },
};
