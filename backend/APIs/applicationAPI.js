import express from "express";

import {
  applyCompany,
  myApplications,
  companyApplicants,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post(
  "/apply/:companyId",
  verifyToken,
  applyCompany
);

router.get(
  "/my-applications",
  verifyToken,
  myApplications
);

router.get(
  "/company/:companyId",
  verifyToken,
  verifyAdmin,
  companyApplicants
);

router.put(
  "/update-status/:applicationId",
  verifyToken,
  verifyAdmin,
  updateApplicationStatus
);

export default router;