import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const CATEGORIES = [
  "Crop Management",
  "Pest Control",
  "Soil Health",
  "Trending",
  "Announcements",
];

export default function ForumCreate() {
  const [form, setForm] = useState({ title: "", body: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/forum/post", form, {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/forum");
      } else {
        setError(res.data.message || "Could not create post.");
      }
    } catch (err) {
      setError("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-display">
      {/* TopNavBar - simple */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="size-6 text-[#4CAF50] font-bold">
            <svg width={30} height={30} viewBox="0 0 48 48">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight">Krishisathi</span>
        </div>
        <nav className="flex gap-10">
          <Link to="/" className="text-[#6D4C41] hover:text-[#3E2723]">
            Home
          </Link>
          <Link to="#" className="text-[#6D4C41] hover:text-[#3E2723]">
            Market
          </Link>
          <Link to="/forum" className="text-[#3E2723] font-bold">
            Forum
          </Link>
        </nav>
        <div
          className="bg-center bg-cover rounded-full size-9"
          style={{ backgroundImage: `url('/avatar.jpg')` }}></div>
      </header>

      {/* Main form card */}
      <div className="flex justify-center items-start py-12 px-2">
        <div className="w-full max-w-xl mx-auto bg-white p-8 shadow-lg rounded-lg border border-[#EEEEEE]">
          <h2 className="text-2xl font-black mb-6 text-[#3E2723]">
            Start a Discussion
          </h2>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              autoFocus
              required
              placeholder="Post title"
              value={form.title}
              onChange={handleChange}
              className="form-input border border-[#EEEEEE] rounded-lg p-3"
            />
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="form-select border border-[#EEEEEE] rounded-lg p-3">
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <textarea
              name="body"
              required
              placeholder="Your post details..."
              value={form.body}
              onChange={handleChange}
              rows={7}
              className="form-textarea border border-[#EEEEEE] rounded-lg p-3"
            />
            {error && (
              <div className="rounded bg-red-100 border border-red-300 p-2 text-red-600 text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-4 items-center">
              <button
                type="submit"
                className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C] disabled:opacity-50 text-white py-3 px-4 rounded-lg font-bold transition"
                disabled={loading}>
                {loading ? "Creating..." : "Create Post"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/forum")}
                className="text-[#4CAF50] border border-[#4CAF50] bg-white hover:bg-[#F5F5F5] px-4 py-3 rounded-lg font-bold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
