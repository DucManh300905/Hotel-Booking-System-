import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Bảo vệ route cần đăng nhập
export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Bảo vệ route chỉ dành cho admin
export function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/rooms" replace />;
  }
  return children;
}
