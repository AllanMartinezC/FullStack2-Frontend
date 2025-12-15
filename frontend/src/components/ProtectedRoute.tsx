import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  isAllowed: boolean; 
  redirectTo?: string; 
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ isAllowed, redirectTo = "/login", children }: Props) => {
  if (!isAllowed) {
    // Si no cumple la condición, redirigir
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};