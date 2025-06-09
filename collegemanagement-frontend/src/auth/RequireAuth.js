import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = ({ children, allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(auth.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default RequireAuth;