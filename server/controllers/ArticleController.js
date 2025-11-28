import Article from "../models/Article.js";
import { v2 as cloudinary } from "cloudinary";

// CREATE ARTICLE
export const createArticle = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const coverImageFile = req?.file; // Multer stores the file in req.file

    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let coverImage = "";

    if (coverImageFile) {
      const result = await cloudinary.uploader.upload(coverImageFile.path, {
        resource_type: "image",
        folder: "article_cover",
      });
      coverImage = result.secure_url;
    }

    // Optional read time calculation (Words / 200)
    const words = content.split(" ").length;
    const readTime = Math.ceil(words / 200);

    const article = await Article.create({
      title,
      category,
      content,
      coverImage,
      author: req?.user?._id, // Use req.user._id
      readTime,
    });

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error("Create Article Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL ARTICLES
export const getArticle = async (req, res) => {
  try {
    const article = await Article.find().populate("author", "name");
    res.json({ success: true, article });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET ARTICLE BY ID
export const getOneArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id).populate("author", "name");

    if (!article) {
      return res.json({ success: false, message: "Article not found" });
    }

    res.json({ success: true, article });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// UPDATE ARTICLE
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = req.body;

    // Handle image update
    if (req.file) {
      const upload = await cloudinary.uploader.upload(
        req.files.coverImage.path,
        {
          resource_type: "image",
          folder: "article_cover",
        }
      );
      updatedData.coverImage = upload.secure_url;
    }

    const article = await Article.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!article) {
      return res.json({ success: false, message: "Article not found" });
    }

    res.json({
      success: true,
      message: "Article updated",
      article,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE ARTICLE
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    res.json({ success: true, message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
