import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32]"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    toast.error("Please login to access this page");
    return <Navigate to="/" replace />;
  }

  // If admin is required and user is not admin
  if (requireAdmin && user.role !== "admin") {
    toast.error("Only admins can access this page");
    return <Navigate to="/article" replace />;
  }

  return children;
};

export default ProtectedRoute;
