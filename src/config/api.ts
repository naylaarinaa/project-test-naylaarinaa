export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "",
  ENDPOINTS: {
    IDEAS: "/api/ideas",
  },
  DEFAULT_PARAMS: {
    PAGE_SIZE: 10,
    SORT: {
      NEWEST: "-published_at",
      OLDEST: "published_at",
    },
    APPEND: ["small_image", "medium_image"],
  },
};

// Helper
export const buildApiUrl = (
  endpoint: string,
  params: Record<string, any> = {}
) => {
  const baseUrl = API_CONFIG.BASE_URL;
  const url = new URL(endpoint, baseUrl || window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v));
    } else if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });

  return url.toString();
};

// API service class
export class ApiService {
  private static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const defaultOptions: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Server returned HTML instead of JSON. Check API configuration."
        );
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  static async getIdeas(params: {
    page: number;
    pageSize: number;
    sort: string;
  }) {
    const apiParams = {
      "page[number]": params.page,
      "page[size]": params.pageSize,
      "append[]": API_CONFIG.DEFAULT_PARAMS.APPEND,
      sort:
        params.sort === "Newest"
          ? API_CONFIG.DEFAULT_PARAMS.SORT.NEWEST
          : API_CONFIG.DEFAULT_PARAMS.SORT.OLDEST,
    };

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.IDEAS, apiParams);
    return await this.request<any>(url);
  }
}
