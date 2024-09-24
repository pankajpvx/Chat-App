import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ user, children, redirect = "/login" }) {
  if (!user) return <Navigate to={redirect} />;
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
