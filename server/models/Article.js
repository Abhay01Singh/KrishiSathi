import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: String,
  category: {
    type: String,
    enum: [
      "Best Practices",
      "Technology",
      "Soil Health",
      "Crop Management",
      "Market News",
    ],
  },
  content: String,
  coverImage: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  readTime: { Number },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Article", ArticleSchema);
