import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// add product
export const addProduct = async (req, res) => {
  try {
    const { name, category, price, unit, description, rating } = req.body;
    if (!name || !category || !price || !unit || !description || !rating)
      return res.json({ success: false, message: "All field are required" });
    const productImage = req?.file;
    let image = "";
    if (productImage) {
      const result = await cloudinary.uploader.upload(productImage.path, {
        resource_type: "image",
        folder: "product_Image",
      });
      image = result.secure_url;
    }
    const product = await Product.create({
      name,
      category,
      price,
      unit,
      description,
      image,
      seller: req.user._id,
      rating,
    });
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("seller", "name");
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get all product
export const getAllProduct = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== "All Products") {
      query.category = { $regex: category, $options: "i" };
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const product = await Product.find(query)
      .populate("seller", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = req.body;

    // Handle image update
    if (req.file) {
      const upload = await cloudinary.uploader.upload(
        req.files.productImage.path,
        {
          resource_type: "image",
          folder: "product_image",
        }
      );
      updatedData.coverImage = upload.secure_url;
    }

    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
