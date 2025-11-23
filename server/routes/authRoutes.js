import express from "express";
import {
  register,
  login,
  logout,
  isAuth,
} from "../controllers/authController.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/isauth", authUser, isAuth);
router.post("/logout", logout);

export default router;
