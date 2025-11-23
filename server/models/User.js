import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ["farmer", "moderator", "admin"],
    default: "farmer",
  },
  avatar: String,
  region: String,
  farmingType: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
