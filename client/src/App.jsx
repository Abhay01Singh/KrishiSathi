import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext.jsx";
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

const App = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/article" element={<KnowledgeHub />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/article/new" element={<ArticleForm />} />
      <Route path="/article/edit/:id" element={<ArticleForm />} />
      <Route path="/forum" element={<ForumList />} />
      <Route path="/forum/post/:id" element={<ForumDetail />} />
      <Route path="/forum/new" element={<ForumCreate />} />
      <Route path="/product" element={<MarketplacePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/admin/products" element={<ProductAdminPanel />} />
    </Routes>
  );
};

export default App;
