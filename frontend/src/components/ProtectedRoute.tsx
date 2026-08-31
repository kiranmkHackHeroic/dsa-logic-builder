import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that guards routes requiring authentication.
 * Redirects unauthenticated users to the auth page with return URL.
 */
export const ProtectedRoute = ({
  children,
  requireAdmin = false,
  redirectTo = "/auth",
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const location = useLocation();

  const shouldWaitForRole = requireAdmin;

  // Show loading state while checking authentication
  if (loading || (shouldWaitForRole && roleLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    // Save the attempted URL for redirecting after login
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check admin role if required
  if (requireAdmin && !isAdmin) {
    return (
      <Navigate 
        to="/dashboard" 
        state={{ error: "You don't have permission to access this page" }}
        replace 
      />
    );
  }

  return <>{children}</>;
};

/**
 * PublicRoute component that redirects authenticated users.
 * Useful for login/register pages that shouldn't be accessible when logged in.
 */
interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({
  children,
  redirectTo = "/dashboard",
}: PublicRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to intended destination or dashboard if already authenticated
  if (user) {
    const from = (location.state as { from?: string })?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
