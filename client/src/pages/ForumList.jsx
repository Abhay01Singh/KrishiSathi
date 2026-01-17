import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext.jsx";
import Navbar from "../components/Navbar.jsx";

const CATEGORIES = [
  "All",
  "Crop Management",
  "Pest Control",
  "Soil Health",
  "Trending",
  "Announcements",
];

export default function ForumList() {
  const { user } = useAppContext();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch forum posts
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("/api/forum/posts", {
        // params is main factor to categories post according to category and search
        params: { category, search },
      });

      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category, search]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen font-display">
      <header className="sticky top-0 z-10 bg-white border-b py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-[#3E2723]">
            <span className="size-6 text-[#4CAF50] font-bold">
              <svg width={30} height={30} viewBox="0 0 48 48">
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight">
              Krishisathi
            </span>
          </div>
          <Navbar />
        </div>
        <div className="flex gap-4 items-center">
          <input
            className="bg-[#F5F5F5] px-4 py-2 rounded-lg w-64 outline-none border-none"
            placeholder="Search forum..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className="bg-center bg-cover rounded-full size-10"
            style={{ backgroundImage: `url('/avatar.jpg')` }}></div>
        </div>
      </header>
      <div className="flex justify-center py-8 px-4">
        <main className="flex-grow w-full max-w-3xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-4xl font-black mb-4 sm:mb-0">
              Krishisathi Discussions
            </h1>
            <button
              className="flex gap-2 items-center px-5 h-12 bg-[#4CAF50] text-white font-bold rounded-lg"
              onClick={() => navigate("/forum/new")}>
              <span className="material-symbols-outlined">add</span>Start a
              Discussion
            </button>
          </div>
          <div className="flex gap-2 mb-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg font-bold ${
                  cat === category
                    ? "bg-[#C8E6C9] text-[#4CAF50]"
                    : "bg-white text-[#6D4C41]"
                }`}
                onClick={() => setCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-white border border-[#EEEEEE]">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/forum/post/${post._id}`}
                className={`flex flex-col sm:flex-row gap-4 p-4 items-start border-b last:border-none 
                                ${
                                  post.category === "Announcements"
                                    ? "bg-[#FFF8E1] border-l-4 border-[#4CAF50]"
                                    : ""
                                }`}>
                <div className="flex gap-4 items-start">
                  <div
                    className="bg-center bg-cover rounded-full size-12"
                    style={{
                      backgroundImage: `url('${
                        post.user?.avatar || "/avatar.jpg"
                      }')`,
                    }}></div>
                  <div>
                    <div className="flex items-center gap-2">
                      {post.category === "Announcements" && (
                        <span className="material-symbols-outlined text-[#4CAF50]">
                          push_pin
                        </span>
                      )}
                      <span className="font-bold">{post.title}</span>
                    </div>
                    <p className="text-[#6D4C41] text-sm mt-1">
                      {post.body.slice(0, 120)}...
                    </p>
                    <p className="text-xs mt-2">
                      {post.user?.name || "User"} •{" "}
                      <span className="text-[#4CAF50] font-semibold">
                        #{post.category}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 sm:flex-col items-end sm:items-start sm:w-28 gap-2 mt-2 sm:mt-0 text-[#6D4C41] text-sm">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">
                        forum
                      </span>
                      <span>{post.replies.length}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">
                        visibility
                      </span>
                      <span>{post.views || 0}</span>
                    </span>
                  </div>
                  <span className="text-xs">
                    {formatTimeAgo(post.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
        {/* Sidebar ...as per previous code */}
      </div>
    </div>
  );
}

// Helper function
function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const diff = Math.floor((new Date() - date) / (1000 * 60)); // minutes
  if (diff < 60) return `${diff} minutes ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
