import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Navigate } from "@tanstack/react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, loginStatus } = useInternetIdentity();

  // Identity confirmed present — allow through
  if (identity) {
    return <>{children}</>;
  }

  // Login explicitly failed or user is not authenticated
  if (loginStatus === "loginError" || loginStatus === "idle") {
    return <Navigate to="/login" />;
  }

  // Still loading auth state — hold position to avoid navigation flash
  return null;
}
