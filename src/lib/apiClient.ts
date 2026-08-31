/**
 * Centralized fetch-based API client — replaces the Supabase JS client.
 * Automatically attaches JWT tokens and handles JSON serialization.
 */
import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    if (response.status === 401) {
      // Token expired or invalid — clear token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Only redirect if not already on the auth page
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth";
        }
      }
    }
    throw new ApiError(message, response.status);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const apiClient = {
  async get<T = unknown>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: authHeaders(),
    });
    return handleResponse<T>(res);
  },

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T = unknown>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T = unknown>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse<T>(res);
  },

  async upload<T = unknown>(path: string, formData: FormData): Promise<T> {
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    // Do NOT set Content-Type — let browser set multipart boundary
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handleResponse<T>(res);
  },

  /** Get the full URL for a server-hosted asset (e.g. avatar). */
  assetUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  },
};
