import mongoose from "mongoose";
const StorySchema = new mongoose.Schema({
  title: String,
  farmerName: String,
  location: String,
  content: String,
  image: String,

  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SuccessStroy", StorySchema);
