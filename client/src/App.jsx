import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ArticleDetail from "./pages/ArticleDetails.jsx";
import ArticleForm from "./pages/ArticleForm.jsx";
import KnowledgeHub from "./pages/KnowledgeHub.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ForumList from "./pages/ForumList.jsx";
import ForumDetail from "./pages/ForumDetails.jsx";
import ForumCreate from "./pages/ForumCreate.jsx";
import MarketplacePage from "./pages/MarketPlacePage.jsx";
import ProductAdminPanel from "./pages/ProductAdminPage.jsx";
import ProductDetailPage from "./pages/ProductDetailsPage.jsx";
import DashBoard from "./pages/DashBoard.jsx";

const App = () => {
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

  return (
    <>
      {/* Navbar appears on all pages except auth page for logged-in users */}
      {user && <Navbar />}

      <Routes>
        {/* Auth Page - Only for non-logged-in users */}
        <Route
          path="/"
          element={user ? <Navigate to="/article" replace /> : <AuthPage />}
        />

        {/* Public Routes - Anyone can view articles and forum (read-only) */}
        <Route path="/article" element={<KnowledgeHub />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/forum" element={<ForumList />} />
        <Route path="/forum/post/:id" element={<ForumDetail />} />
        <Route path="/product" element={<MarketplacePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Protected Routes - Only authenticated users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/new"
          element={
            <ProtectedRoute>
              <ArticleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/edit/:id"
          element={
            <ProtectedRoute>
              <ArticleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/new"
          element={
            <ProtectedRoute>
              <ForumCreate />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <ProductAdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to articles */}
        <Route path="*" element={<Navigate to="/article" replace />} />
      </Routes>
    </>
  );
};

export default App;
