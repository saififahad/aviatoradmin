import { Outlet, Navigate } from "react-router-dom";
export default function ProtectedRoute() {
  const token = localStorage.getItem("admin");
  if (!token) {
    return <Navigate to="/Login" replace />;
  }
  return <Outlet />;
}
