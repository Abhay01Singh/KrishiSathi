import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // If present, edit mode
  const { navigate } = useAppContext();

  useEffect(() => {
    if (id) {
      axios.get(`/api/article/get/${id}`).then((res) => {
        if (res.data.success) setForm(res.data.article);
      });
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("category", form.category);
    data.append("content", form.content);
    if (imageFile) data.append("coverImage", imageFile);

    // If you have user auth, send `author` field too
    // data.append("author", currentUserId);

    const req = id
      ? axios.put(`/api/article/update/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : axios.post("/api/article/create", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    req
      .then((res) => {
        if (res.data.success) {
          navigate("/article");
          toast.success("Article created successfully");
        } else {
          alert(res.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  // Delete handler
  const handleDelete = () => {
    if (!id) return;
    if (window.confirm("Delete this article?")) {
      axios.delete(`/api/article/${id}`).then((res) => {
        if (res.data.success) navigate("/");
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="max-w-7xl m-auto px-4 py-6 border-b border-[#F5F5F5] flex items-center justify-between">
        <span className="flex items-center gap-3 text-[#2E7D32]">
          <span className="material-symbols-outlined text-3xl">
            agriculture
          </span>
          <span className="font-bold text-xl">Krishisathi</span>
        </span>
        <button
          onClick={() => navigate("/")}
          className="bg-[#2E7D32] text-white px-3 py-1 rounded font-bold">
          Back
        </button>
      </header>
      <main className="max-w-lg m-auto px-4 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-[#F5F5F5] rounded-lg p-8 shadow-lg flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-2">
            {id ? "Edit Article" : "Create Article"}
          </h2>
          <input
            type="text"
            name="title"
            required
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="form-input border rounded-lg p-3"
          />
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="form-select border rounded-lg p-3">
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            name="content"
            required
            placeholder="Article Content"
            value={form.content}
            onChange={handleChange}
            rows={8}
            className="form-textarea border rounded-lg p-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input mt-3"
          />
          {form.coverImage && !imageFile && (
            <img
              src={form.coverImage}
              alt=""
              className="mt-2 mb-1 rounded-xl w-full h-48 object-cover"
            />
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2E7D32] text-white px-6 py-2 rounded font-bold">
              {id ? "Update" : "Create"}
            </button>
            {id && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded font-bold">
                Delete
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default ArticleForm;
