import express from "express";
import upload from "../config/multer.js";
import {
  registerUser,
  loginUser,
  getProfile,
  uploadResume,
  updateProfile,
} from "../controllers/authController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile);
router.put("/profile/update", verifyToken, updateProfile);
router.put(
  "/upload-resume",
  verifyToken,
  upload.single("resume"),
  uploadResume
);

export default router;