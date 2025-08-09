const STOCK_API_URL = process.env.NEXT_PUBLIC_STOCK_API_URL || "/api/stock";
const TRADING_API_URL =
  process.env.NEXT_PUBLIC_TRADING_API_URL || "http://localhost:8080";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(this.cleanParams(params)).toString()}`
      : endpoint;

    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private cleanParams(params: Record<string, any>): Record<string, string> {
    const cleaned: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        cleaned[key] = String(value);
      }
    }

    return cleaned;
  }
}

export const stockApiClient = new ApiClient(STOCK_API_URL);
export const tradingApiClient = new ApiClient(TRADING_API_URL);
