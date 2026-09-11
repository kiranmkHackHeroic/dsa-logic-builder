/**
 * Centralized fetch-based API client — replaces the Supabase JS client.
 * Automatically attaches JWT tokens, handles JSON serialization,
 * and provides full client-side emulation for Demo / Guest mode.
 */
import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const GUEST_TOKEN = "demo-guest-token";

function isGuest(): boolean {
  return getToken() === GUEST_TOKEN;
}

function getGuestStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setGuestStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

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
      // Token expired or invalid — clear token unless in guest mode
      if (typeof window !== "undefined") {
        const currentToken = getToken();
        if (currentToken && currentToken !== GUEST_TOKEN) {
          localStorage.removeItem("auth_token");
          // Only redirect if not already on the auth page
          if (!window.location.pathname.startsWith("/auth")) {
            window.location.href = "/auth";
          }
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
    if (isGuest()) {
      if (path === "/api/auth/me") {
        return {
          user: getGuestStorage("dsa_guest_user", {
            id: "guest-user",
            email: "guest@dsalogicbuilder.com",
            display_name: "Guest Explorer",
            avatar_url: null,
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
          }),
        } as T;
      }
      if (path === "/api/profiles/me") {
        return getGuestStorage("dsa_guest_profile", {
          id: "guest-user",
          email: "guest@dsalogicbuilder.com",
          display_name: "Guest Explorer",
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }) as T;
      }
      if (path === "/api/streaks") {
        return getGuestStorage("dsa_guest_streak", {
          id: "guest-streak",
          user_id: "guest-user",
          current_streak: 1,
          longest_streak: 3,
          last_activity_date: new Date().toISOString().split("T")[0],
          total_problems_solved: 3,
          total_problems_attempted: 6,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }) as T;
      }
      if (path === "/api/roles") {
        return { roles: ["user"] } as T;
      }
      if (path === "/api/progress") {
        return getGuestStorage("dsa_guest_progress_list", []) as T;
      }
      if (path.startsWith("/api/progress/")) {
        const problemId = path.replace("/api/progress/", "");
        const list: any[] = getGuestStorage("dsa_guest_progress_list", []);
        const item = list.find((p) => p.problem_id === problemId);
        return (item || null) as T;
      }
    }

    const res = await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: authHeaders(),
    });
    return handleResponse<T>(res);
  },

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    if (isGuest()) {
      if (path.startsWith("/api/streaks/record-activity")) {
        const streak = getGuestStorage("dsa_guest_streak", {
          id: "guest-streak",
          user_id: "guest-user",
          current_streak: 1,
          longest_streak: 3,
          last_activity_date: new Date().toISOString().split("T")[0],
          total_problems_solved: 3,
          total_problems_attempted: 6,
        });
        streak.last_activity_date = new Date().toISOString().split("T")[0];
        setGuestStorage("dsa_guest_streak", streak);
        return streak as T;
      }
      if (path.startsWith("/api/streaks/increment-solved")) {
        const streak = getGuestStorage("dsa_guest_streak", {
          id: "guest-streak",
          user_id: "guest-user",
          current_streak: 1,
          longest_streak: 3,
          last_activity_date: new Date().toISOString().split("T")[0],
          total_problems_solved: 3,
          total_problems_attempted: 6,
        });
        streak.total_problems_solved = (streak.total_problems_solved || 0) + 1;
        setGuestStorage("dsa_guest_streak", streak);
        return streak as T;
      }
      if (path.startsWith("/api/streaks/increment-attempted")) {
        const streak = getGuestStorage("dsa_guest_streak", {
          id: "guest-streak",
          user_id: "guest-user",
          current_streak: 1,
          longest_streak: 3,
          last_activity_date: new Date().toISOString().split("T")[0],
          total_problems_solved: 3,
          total_problems_attempted: 6,
        });
        streak.total_problems_attempted = (streak.total_problems_attempted || 0) + 1;
        setGuestStorage("dsa_guest_streak", streak);
        return streak as T;
      }
    }

    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T = unknown>(path: string, body?: any): Promise<T> {
    if (isGuest()) {
      if (path === "/api/profiles/me") {
        const profile = getGuestStorage("dsa_guest_profile", {
          id: "guest-user",
          email: "guest@dsalogicbuilder.com",
          display_name: "Guest Explorer",
          avatar_url: null,
        });
        const updated = { ...profile, ...body, updated_at: new Date().toISOString() };
        setGuestStorage("dsa_guest_profile", updated);
        return updated as T;
      }
      if (path.startsWith("/api/progress/")) {
        const problemId = path.replace("/api/progress/", "");
        const list: any[] = getGuestStorage("dsa_guest_progress_list", []);
        const idx = list.findIndex((p) => p.problem_id === problemId);
        const updated = {
          id: `guest-prog-${problemId}`,
          user_id: "guest-user",
          problem_id: problemId,
          current_step: 1,
          status: "in_progress",
          completed_steps: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...(idx >= 0 ? list[idx] : {}),
          ...body,
        };
        if (idx >= 0) {
          list[idx] = updated;
        } else {
          list.push(updated);
        }
        setGuestStorage("dsa_guest_progress_list", list);
        return updated as T;
      }
      if (path === "/api/streaks") {
        const streak = getGuestStorage("dsa_guest_streak", {
          id: "guest-streak",
          user_id: "guest-user",
          current_streak: 1,
          longest_streak: 3,
          last_activity_date: new Date().toISOString().split("T")[0],
          total_problems_solved: 3,
          total_problems_attempted: 6,
        });
        const updated = { ...streak, ...body, updated_at: new Date().toISOString() };
        setGuestStorage("dsa_guest_streak", updated);
        return updated as T;
      }
    }

    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T = unknown>(path: string): Promise<T> {
    if (isGuest()) {
      return null as T;
    }
    const res = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse<T>(res);
  },

  async upload<T = unknown>(path: string, formData: FormData): Promise<T> {
    if (isGuest()) {
      return { avatar_url: "" } as T;
    }
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
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
