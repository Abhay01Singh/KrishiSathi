import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ArticleDetail from "./pages/ArticleDetails.jsx";
import ArticleForm from "./pages/ArticleForm.jsx";
import KnowledgeHub from "./pages/KnowledgeHub.jsx";

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
      <Route path="/article/:id/edit" element={<ArticleForm />} />
    </Routes>
  );
};

export default App;
