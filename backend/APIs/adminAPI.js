import express from "express";

import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

import {
  dashboardStats,
  getAllApplications,
  getSelectedStudents,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/dashboard-stats",
  verifyToken,
  verifyAdmin,
  dashboardStats
);

router.get(
  "/applications",
  verifyToken,
  verifyAdmin,
  getAllApplications
);

router.get(
  "/selected-students",
  verifyToken,
  verifyAdmin,
  getSelectedStudents
);

export default router;