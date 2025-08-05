const STOCK_API_URL = process.env.NEXT_PUBLIC_STOCK_API_URL || "/api/stock";
const TRADING_API_URL =
  process.env.NEXT_PUBLIC_TRADING_API_URL || "/api/trading";

class ApiClient {
  private baseURL: string;
  private isStockApi: boolean;

  constructor(baseURL: string, isStockApi = false) {
    this.baseURL = baseURL;
    this.isStockApi = isStockApi;
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

      const data = await response.json();

      return this.convertTimestamps(data);
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  private convertTimestamps(data: any): any {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.convertTimestamps(item));
    }

    if (typeof data === "object") {
      const converted = { ...data };

      if (this.isStockApi) {
        this.convertStockTimestamps(converted);
      } else {
        this.convertTradingTimestamps(converted);
      }

      for (const key in converted) {
        if (typeof converted[key] === "object") {
          converted[key] = this.convertTimestamps(converted[key]);
        }
      }

      return converted;
    }

    return data;
  }

  private convertStockTimestamps(obj: any): void {
    const stockTimeFields = ["timeStamp", "periodStartTime", "periodEndTime"];

    for (const field of stockTimeFields) {
      if (obj[field] && typeof obj[field] === "string") {
        if (this.isTimeFormat(obj[field])) {
          obj[field] = this.parseTimeToDate(obj[field]);
        } else {
          obj[field] = new Date(obj[field]);
        }
      }
    }
  }

  private convertTradingTimestamps(obj: any): void {
    const tradingDateFields = ["createdAt", "tradeTime"];

    for (const field of tradingDateFields) {
      if (obj[field] && typeof obj[field] === "string") {
        obj[field] = new Date(obj[field]);
      }
    }
  }

  private isTimeFormat(timeStr: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return timeRegex.test(timeStr);
  }

  private parseTimeToDate(timeStr: string): Date {
    const today = new Date();
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);

    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    date.setHours(hours || 0, minutes, seconds, 0);

    return date;
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
        if (value instanceof Date) {
          if (this.isStockApi) {
            const timeFields = [
              "timeStamp",
              "periodStartTime",
              "periodEndTime",
            ];
            if (timeFields.includes(key)) {
              cleaned[key] = this.formatTimeForApi(value) || "";
            } else {
              cleaned[key] = value.toISOString();
            }
          } else {
            cleaned[key] = value.toISOString();
          }
        } else {
          cleaned[key] = String(value);
        }
      }
    }

    return cleaned;
  }

  private formatTimeForApi(date: Date): string | undefined {
    return date.toTimeString().split(" ")[0];
  }
}

export const stockApiClient = new ApiClient(STOCK_API_URL, true);
export const tradingApiClient = new ApiClient(TRADING_API_URL, false);
