import express from "express";
import authUser from "../middleware/authUser.js";
import {
  createPost,
  createReply,
  getPost,
  getPosts,
} from "../controllers/forumController.js";

const forumRouter = express.Router();

forumRouter.get("/posts", authUser, getPosts);
forumRouter.get("/post/:id", authUser, getPost);
forumRouter.post("/post", authUser, createPost);
forumRouter.post("/reply", authUser, createReply);

export default forumRouter;
