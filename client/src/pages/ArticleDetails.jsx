import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data } = await axios.get(`/api/article/get/${id}`);
        if (data.success) {
          setArticle(data.article);
        } else {
          setArticle(null);
        }
      } catch (error) {
        setArticle(null);
      } finally {
        setLoading(false); // Now loading state will update
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!article)
    return <div className="p-10 text-center">Article not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-7xl m-auto px-4 py-6 border-b border-[#F5F5F5] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-[#2E7D32]">
          <span className="font-bold text-xl">Krishisathi</span>
        </Link>
        <Link
          to="/article"
          className="bg-[#2E7D32] text-white px-3 py-1 rounded font-bold">
          Back
        </Link>
      </header>
      <main className="max-w-3xl m-auto px-4 py-10">
        <div
          className="aspect-video bg-center bg-cover rounded-xl"
          style={{ backgroundImage: `url('${article.coverImage}')` }}
        />
        <h1 className="mt-8 text-4xl font-black leading-tight">
          {article.title}
        </h1>
        <div className="text-[#FB8C00] font-bold uppercase tracking-wider mt-3">
          {article.category}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 mb-4 text-gray-500 text-sm items-center">
          <span>
            By{" "}
            <span className="font-bold text-[#2E7D32]">
              {article.author?.name || "Unknown"}
            </span>
          </span>
          <span>{article.readTime} min read</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-6 text-lg leading-relaxed">{article.content}</div>
      </main>
    </div>
  );
}

export default ArticleDetail;
