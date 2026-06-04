import express from "express";

import {
  addCompany,
  getAllCompanies,
  deleteCompany,
  updateCompany,
} from "../controllers/companyController.js";

import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post(
  "/add",
  verifyToken,
  verifyAdmin,
  addCompany
);

router.get(
  "/all",
  verifyToken,
  getAllCompanies
);

router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  updateCompany
);

router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  deleteCompany
);

export default router;