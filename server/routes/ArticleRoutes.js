import express from "express";
import authUser from "../middleware/authUser.js";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getOneArticle,
  updateArticle,
} from "../controllers/ArticleController.js";
import { upload } from "../config/multer.js";

const articleRouter = express.Router();

articleRouter.post(
  "/create",
  authUser,
  upload.single("coverImage"),
  createArticle
);
articleRouter.get("/get", authUser, getArticle);
articleRouter.get("/get/:id", authUser, getOneArticle);
articleRouter.put(
  "/update/:id",
  authUser,
  upload.single("coverImage"),
  updateArticle
);
articleRouter.delete("/delete/:id", authUser, deleteArticle);

export default articleRouter;
