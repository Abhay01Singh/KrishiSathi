import mongoose from "mongoose";

const ForumPostSchema = new mongoose.Schema({
  title: String,
  body: String,
  category: {
    type: String,
    enum: [
      "Crop Management",
      "Pest Control",
      "Soil Health",
      "Trending",
      "Announcements",
    ],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "ForumReply" }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ForumPost", ForumPostSchema);
