import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();
  if (!auth.token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(auth.role))
    return <Navigate to="/unauthorized" />;
  return <Outlet />;
};

export default ProtectedRoute;