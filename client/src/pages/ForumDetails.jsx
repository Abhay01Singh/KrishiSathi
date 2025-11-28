import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

// Utility: format date as "2 hours ago" etc.
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const minutes = Math.floor((now - date) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function ForumDetail() {
  const { id } = useParams();
  const [post, setPost] = useState();
  const [replyMsg, setReplyMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/forum/post/${id}`).then((res) => {
      if (res.data.success) setPost(res.data.post);
      setLoading(false);
    });
    // Socket.io for live replies:
    const s = io("http://localhost:3000");
    setSocket(s);
    s.on("newReply", (reply) => {
      setPost((prev) => ({ ...prev, replies: [...prev.replies, reply] }));
    });
    return () => s.disconnect();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMsg.trim()) return;
    setSubmitLoading(true);
    const res = await axios.post("/api/forum/reply", {
      postId: id,
      message: replyMsg,
    });
    setSubmitLoading(false);
    if (res.data.success) {
      setReplyMsg("");
      socket.emit("newReply", res.data.reply);
      setPost((prev) => ({
        ...prev,
        replies: [...prev.replies, res.data.reply],
      }));
    }
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!post)
    return <div className="p-12 text-center text-red-500">Post not found.</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-display py-8">
      <div className="max-w-3xl mx-auto px-2">
        {/* Post Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-10 border border-[#EEEEEE]">
          <div className="flex items-center gap-3 mb-1">
            <img
              src={post.user?.avatar || "/avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-[#E4E4E4]"
            />
            <span className="font-semibold">
              {post.user?.name || "Unknown"}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {timeAgo(post.createdAt)}
            </span>
            <span
              className={`ml-4 px-2 py-0.5 bg-[#E8F5E9] text-[#388E3C] rounded font-medium text-xs`}>
              #{post.category}
            </span>
          </div>
          <h2 className="text-2xl font-black mb-3 mt-1 text-[#3E2723]">
            {post.title}
          </h2>
          <div className="text-base text-gray-800 whitespace-pre-wrap">
            {post.body}
          </div>
        </div>

        {/* Replies Section */}
        <section className="bg-white rounded-xl border border-[#EEEEEE] p-6 mb-6">
          <h3 className="font-black text-lg mb-4 text-[#4CAF50]">
            {post.replies.length} Reply{post.replies.length !== 1}
          </h3>
          {post.replies.length === 0 && (
            <div className="text-gray-400 mb-7">
              No replies yet. Be the first!
            </div>
          )}
          <div className="flex flex-col gap-5">
            {post.replies.map((reply) => (
              <div
                key={reply._id}
                className="flex gap-3 border-b py-3 last:border-b-0">
                <img
                  src={reply.user?.avatar || "/avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-[#E0E0E0] mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <span className="font-bold text-[#3E2723]">
                      {reply.user?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {timeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <div className="text-gray-800">{reply.message}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add a Reply */}
        <form
          onSubmit={handleReply}
          className="bg-white rounded-xl border border-[#EEEEEE] shadow px-6 py-5 flex gap-3 items-start">
          <img
            src="/avatar.png"
            alt="Your avatar"
            className="w-10 h-10 rounded-full border border-[#E4E4E4] mt-0.5"
          />
          <div className="flex-grow flex flex-col gap-2">
            <textarea
              className="form-textarea w-full border border-[#E0E0E0] rounded-lg p-3 resize-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition"
              placeholder="Write your reply…"
              minLength={2}
              value={replyMsg}
              onChange={(e) => setReplyMsg(e.target.value)}
              rows={2}
              disabled={submitLoading}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitLoading || !replyMsg.trim()}
                className="bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-full px-6 py-2 transition disabled:opacity-50">
                {submitLoading ? "Posting..." : "Reply"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
