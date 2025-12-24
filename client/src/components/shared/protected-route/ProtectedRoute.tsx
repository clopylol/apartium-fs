// 1. External & React
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

// 2. Contexts
import { useAuth } from "@/contexts/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading durumunda loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ds-background-light dark:bg-ds-background-dark">
        <div className="w-8 h-8 border-2 border-ds-action border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated değilse login'e yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated ise children'ı render et
  return <>{children}</>;
};

