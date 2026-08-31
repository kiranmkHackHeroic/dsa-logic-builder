import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppUser, getToken, setToken, clearToken } from "@/lib/auth";
import { apiClient } from "@/lib/apiClient";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for existing token and fetch current user
  useEffect(() => {
    const bootstrapTimeout = window.setTimeout(() => {
      setLoading(false);
    }, 8000);

    const token = getToken();
    if (!token) {
      setLoading(false);
      window.clearTimeout(bootstrapTimeout);
      return;
    }

    apiClient
      .get<{ user: AppUser }>("/api/auth/me")
      .then(({ user }) => {
        setUser(user);
      })
      .catch(() => {
        // Token is invalid or expired — clear it
        clearToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
        window.clearTimeout(bootstrapTimeout);
      });

    return () => {
      window.clearTimeout(bootstrapTimeout);
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { user, token } = await apiClient.post<{ user: AppUser; token: string }>(
        "/api/auth/signup",
        { email, password, displayName }
      );
      setToken(token);
      setUser(user);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user, token } = await apiClient.post<{ user: AppUser; token: string }>(
        "/api/auth/login",
        { email, password }
      );
      setToken(token);
      setUser(user);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await apiClient.post("/api/auth/reset-password", { email });
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      await apiClient.put("/api/auth/update-password", { newPassword });
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, resetPassword, updatePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
