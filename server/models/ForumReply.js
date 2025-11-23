import mongoose from "mongoose";

const ForumReplySchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumPost" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  message: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ForumReply", ForumReplySchema);
