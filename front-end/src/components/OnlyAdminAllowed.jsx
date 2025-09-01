// src/components/OnlyAdminAllowed.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const OnlyAdminAllowed = () => {
  const { isLoggedIN, user } = useSelector((state) => state.user);

  // ⛔ Not logged in → go to login
  if (!isLoggedIN) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Logged in but not admin → go to dashboard
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Logged in & admin → allow access
  return <Outlet />;
};

export default OnlyAdminAllowed;
