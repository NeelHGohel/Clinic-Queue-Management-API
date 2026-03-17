import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const navigate = useNavigate();
  const { loading, isAuthenticated, user } = useAuth();

  
  if (!isAuthenticated) {
    navigate("/login");
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    navigate("/dashboard");
  }
  return children;
}

export default ProtectedRoute;
