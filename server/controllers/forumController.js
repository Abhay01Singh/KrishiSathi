import ForumPost from "../models/ForumPost.js";
import ForumReply from "../models/ForumReply.js";

// GET all posts
export const getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== "All") query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };
    const posts = await ForumPost.find(query)
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name avatar" },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// GET single post by ID
export const getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name avatar" },
      });
    if (!post) return res.json({ success: false, message: "Not found" });
    post.views += 1;
    await post.save();
    res.json({ success: true, post });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// CREATE new post
export const createPost = async (req, res) => {
  try {
    const { title, body, category } = req.body;
    if (!title || !body || !category)
      return res.json({ success: false, message: "Missing fields" });
    const post = await ForumPost.create({
      title,
      body,
      category,
      user: req.user._id, // requires authUser middleware for req.user
    });
    res.json({ success: true, post });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// CREATE reply
export const createReply = async (req, res) => {
  try {
    const { postId, message } = req.body;
    if (!postId || !message)
      return res.json({ success: false, message: "Missing fields" });
    const reply = await ForumReply.create({
      postId,
      user: req.user._id,
      message,
    });
    await ForumPost.findByIdAndUpdate(postId, {
      $push: { replies: reply._id },
    });
    const populatedReply = await reply.populate("user", "name avatar");
    res.json({ success: true, reply: populatedReply });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};
