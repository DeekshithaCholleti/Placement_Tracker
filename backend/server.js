import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authAPI from "./APIs/authAPI.js";
import companyAPI from "./APIs/companyAPI.js";
import applicationAPI from "./APIs/applicationAPI.js";
import adminAPI from "./APIs/adminAPI.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

const rawFrontendUrls = process.env.FRONTEND_URL || "";
const parsedOrigins = rawFrontendUrls
  .split(",")
  .map(url => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://placement-tracker-nine-ashen.vercel.app",
  "https://placement-tracker-fm0cs3v9m.vercel.app"
];

const allowedOrigins = [...new Set([...parsedOrigins, ...defaultOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin ? origin.trim().replace(/\/$/, "") : "";
    
    // Check if origin matches Vercel deployment patterns (e.g. placement-tracker-*.vercel.app)
    const isVercelPreview = /^https:\/\/placement-tracker-.*\.vercel\.app$/.test(normalizedOrigin);

    if (
      !origin || 
      allowedOrigins.includes(normalizedOrigin) || 
      allowedOrigins.includes("*") ||
      isVercelPreview
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authAPI);
app.use("/api/company", companyAPI);

app.use("/api/application", applicationAPI);
app.use("/api/admin", adminAPI);

app.get("/", (req, res) => {
  res.send("Smart Placement Tracker Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});