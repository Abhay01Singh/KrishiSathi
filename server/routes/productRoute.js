import express from "express";
import authUser from "../middleware/authUser.js";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/ProductController.js";
import { upload } from "../config/multer.js";
const productRouter = express.Router();

productRouter.post("/addProduct", authUser, upload.single("image"), addProduct);
productRouter.get("/:id", getProduct);
productRouter.get("/", getAllProduct);
productRouter.put(
  "/update/:id",
  authUser,
  upload.single("image"),
  updateProduct
);
productRouter.delete("/delete/:id", authUser, deleteProduct);

export default productRouter;
