import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const EMPTY_ARTICLE = {
  title: "",
  category: "",
  content: "",
  coverImage: "",
};

const CATEGORIES = [
  "Best Practices",
  "Technology",
  "Soil Health",
  "Crop Management",
  "Market News",
];

function ArticleForm() {
  const [form, setForm] = useState(EMPTY_ARTICLE);
  const [imageFile, setImageFile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const { navigate } = useAppContext();

  /* ================= FETCH USER ARTICLES ================= */
  const fetchArticles = async () => {
    try {
      setArticlesLoading(true);
      const { data } = await axios.get("/api/article/my-articles");
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setArticlesLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("category", form.category);
    data.append("content", form.content);
    if (imageFile) data.append("coverImage", imageFile);

    try {
      const res = editId
        ? await axios.put(`/api/article/update/${editId}`, data)
        : await axios.post("/api/article/create", data);

      if (res.data.success) {
        toast.success(
          editId
            ? "✅ Article updated successfully!"
            : "✅ Article created successfully!"
        );
        setForm(EMPTY_ARTICLE);
        setImageFile(null);
        setEditId(null);
        fetchArticles();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (article) => {
    setForm({
      title: article.title,
      category: article.category,
      content: article.content,
      coverImage: article.coverImage,
    });
    setEditId(article._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= CANCEL EDIT ================= */
  const handleCancel = () => {
    setForm(EMPTY_ARTICLE);
    setImageFile(null);
    setEditId(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await axios.delete(`/api/article/delete/${id}`);
      if (res.data.success) {
        toast.success("🗑️ Article deleted successfully");
        fetchArticles();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete article");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <span className="font-bold text-2xl text-[#2E7D32]">
            🌾 KrishiSathi
          </span>
          <button
            onClick={() => navigate("/article")}
            className="bg-[#2E7D32] hover:bg-[#1b5e20] text-white px-4 py-2 rounded-lg font-semibold transition">
            ← Back to Articles
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= FORM SECTION ================= */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-100 sticky top-20">
              <h2 className="text-2xl font-bold text-[#2E7D32] mb-6">
                {editId ? "✏️ Edit Article" : "📝 Create New Article"}
              </h2>

              <div className="flex flex-col gap-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    name="title"
                    placeholder="Enter article title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 focus:border-[#2E7D32] rounded-lg p-3 focus:outline-none transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 focus:border-[#2E7D32] rounded-lg p-3 focus:outline-none transition">
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    rows={8}
                    placeholder="Write your article content here..."
                    value={form.content}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 focus:border-[#2E7D32] rounded-lg p-3 focus:outline-none transition resize-none"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3"
                  />
                </div>

                {/* Image Preview */}
                {form.coverImage && !imageFile && (
                  <div className="relative">
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="rounded-lg w-full h-40 object-cover border-2 border-green-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Current cover image
                    </p>
                  </div>
                )}

                {imageFile && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="New Cover"
                      className="rounded-lg w-full h-40 object-cover border-2 border-green-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      New image preview
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#2E7D32] hover:bg-[#1b5e20] text-white py-3 rounded-lg font-bold transition disabled:opacity-50">
                    {loading
                      ? "Processing..."
                      : editId
                      ? "Update Article"
                      : "Create Article"}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-bold transition">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* ================= ARTICLES LIST SECTION ================= */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-100">
              <h3 className="text-2xl font-bold text-[#2E7D32] mb-6">
                📚 My Articles ({articles.length})
              </h3>

              {articlesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32]"></div>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No articles created yet.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Create your first article using the form on the left!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div
                      key={article._id}
                      className="border-2 border-gray-200 hover:border-[#2E7D32] rounded-lg p-4 transition transform hover:shadow-md">
                      {/* Article Header */}
                      <div className="flex gap-4">
                        {/* Image */}
                        {article.coverImage && (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-24 h-24 object-cover rounded-lg shrink-0"
                          />
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg text-gray-800 line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex gap-2 mt-2 mb-2">
                            <span className="inline-block bg-[#2E7D32] text-white text-xs px-3 py-1 rounded-full font-semibold">
                              {article.category}
                            </span>
                            <span className="inline-block bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                              📖 {article.readTime || 1} min read
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {article.content.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            📅{" "}
                            {new Date(article.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(article)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition text-sm">
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition text-sm">
                          🗑️ Delete
                        </button>
                        <button
                          onClick={() => navigate(`/article/${article._id}`)}
                          className="flex-1 bg-[#2E7D32] hover:bg-[#1b5e20] text-white py-2 rounded-lg font-semibold transition text-sm">
                          👁️ View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ArticleForm;
