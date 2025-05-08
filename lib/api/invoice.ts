import apiClient from "./client";
import { config } from "@/lib/config";
import mockInvoices from "@/data/mock-invoices.json";
import type {
	ApiResponse,
	CreateInvoiceData,
	CreateInvoiceResponse,
	DeleteInvoiceResponse,
	GetInvoiceResponse,
	GetInvoicesResponse,
	UpdateInvoiceData,
	UpdateInvoiceResponse,
} from "@/types/invoice";

/**
 * Invoice API service
 */
export const invoiceApi = {
	/**
	 * Get all invoices
	 */
	getAllInvoices: async (): Promise<ApiResponse<GetInvoicesResponse>> => {
		if (config.api.useMockData) {
			return mockRequest<GetInvoicesResponse>("/api/invoice", { method: "GET" });
		}
		const response = await apiClient.get<ApiResponse<GetInvoicesResponse>>(
			"/invoice"
		);
		return response.data;
	},

	/**
	 * Get invoice by ID
	 */
	getInvoiceById: async (
		id: string
	): Promise<ApiResponse<GetInvoiceResponse>> => {
		if (config.api.useMockData) {
			return mockRequest<GetInvoiceResponse>(`/api/invoice/${id}`, {
				method: "GET",
			});
		}
		const response = await apiClient.get<ApiResponse<GetInvoiceResponse>>(
			`/api/invoice/${id}`
		);
		return response.data;
	},

	/**
	 * Create invoice
	 */
	createInvoice: async (
		data: CreateInvoiceData
	): Promise<ApiResponse<CreateInvoiceResponse>> => {
		if (config.api.useMockData) {
			return mockRequest<CreateInvoiceResponse>("/api/invoice", {
				method: "POST",
				body: JSON.stringify(data),
			});
		}
		const response = await apiClient.post<ApiResponse<CreateInvoiceResponse>>(
			"/api/invoice",
			data
		);
		return response.data;
	},

	/**
	 * Update invoice
	 */
	updateInvoice: async (
		id: string,
		data: UpdateInvoiceData
	): Promise<ApiResponse<UpdateInvoiceResponse>> => {
		if (config.api.useMockData) {
			return mockRequest<UpdateInvoiceResponse>(`/api/invoice/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		}
		const response = await apiClient.put<ApiResponse<UpdateInvoiceResponse>>(
			`/api/invoice/${id}`,
			data
		);
		return response.data;
	},

	/**
	 * Delete invoice
	 */
	deleteInvoice: async (
		id: string
	): Promise<ApiResponse<DeleteInvoiceResponse>> => {
		if (config.api.useMockData) {
			return mockRequest<DeleteInvoiceResponse>(`/api/invoice/${id}`, {
				method: "DELETE",
			});
		}
		const response = await apiClient.delete<ApiResponse<DeleteInvoiceResponse>>(
			`/api/invoice/${id}`
		);
		return response.data;
	},

	/**
	 * Activate invoice (update status to active)
	 */
	activateInvoice: async (
		id: string
	): Promise<ApiResponse<UpdateInvoiceResponse>> => {
		const data = { invoiceStatus: "1" }; // Active status
		if (config.api.useMockData) {
			return mockRequest<UpdateInvoiceResponse>(`/api/invoice/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			});
		}
		const response = await apiClient.put<ApiResponse<UpdateInvoiceResponse>>(
			`/api/invoice/${id}`,
			data
		);
		return response.data;
	},
};

/**
 * Mock a request (for development)
 */
async function mockRequest<T>(
	endpoint: string,
	options: { method: string; body?: string }
): Promise<ApiResponse<T>> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, config.api.mockDataDelay));

	const method = options.method || "GET";

	// Handle different endpoints
	if (endpoint === "/api/invoice" && method === "GET") {
		return {
			success: true,
			message: "Invoices retrieved successfully",
			data: mockInvoices as unknown as T,
			meta: {
				timestamp: new Date().toISOString(),
			},
		};
	}

	if (endpoint.match(/\/invoice\/[^/]+$/) && method === "GET") {
		const id = endpoint.split("/").pop();
		const invoice = mockInvoices.invoices.find((inv) => inv.id === id);

		if (!invoice) {
			throw new Error("Invoice not found");
		}

		return {
			success: true,
			message: "Invoice retrieved successfully",
			data: { invoice } as unknown as T,
			meta: {
				timestamp: new Date().toISOString(),
			},
		};
	}

	if (endpoint === "/api/invoice" && method === "POST") {
		const body = JSON.parse(options.body as string);
		const newInvoice = {
			...body,
			id: `INV-${Math.floor(Math.random() * 10000)
				.toString()
				.padStart(4, "0")}`,
			invoiceNo: `INV-${Math.floor(Math.random() * 10000)
				.toString()
				.padStart(4, "0")}`,
			invoiceTxHash: `tx${Math.random().toString(36).substring(2, 15)}`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		return {
			success: true,
			message: "Invoice created successfully",
			data: {
				invoice: {
					id: newInvoice.id,
					invoiceNo: newInvoice.invoiceNo,
					invoiceTxHash: newInvoice.invoiceTxHash,
				},
			} as unknown as T,
			meta: {
				timestamp: new Date().toISOString(),
			},
		};
	}

	if (endpoint.match(/\/invoice\/[^/]+$/) && method === "PUT") {
		const id = endpoint.split("/").pop();
		const body = JSON.parse(options.body as string);

		const updatedInvoice = {
			...mockInvoices.invoices.find((inv) => inv.id === id),
			...body,
			updatedAt: new Date().toISOString(),
		};

		return {
			success: true,
			message: "Invoice updated successfully",
			data: { invoice: updatedInvoice } as unknown as T,
			meta: {
				timestamp: new Date().toISOString(),
			},
		};
	}

	if (endpoint.match(/\/invoice\/[^/]+$/) && method === "DELETE") {
		return {
			success: true,
			message: "Invoice deleted successfully",
			data: {} as T,
			meta: {
				timestamp: new Date().toISOString(),
			},
		};
	}

	throw new Error("Not implemented");
}
