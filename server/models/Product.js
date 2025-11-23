import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  category: {
    type: String,
    enum: ["Seeds", "Tools", "Fertilizers", "Livestock"],
  },
  price: Number,
  unit: String,
  description: String,
  image: String,

  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", ProductSchema);
