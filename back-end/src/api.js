import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";

/** Express app */
export var app = express();

// ==============================
// Middlewares
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: process.env.FRONTEND_BASE_URL, credentials: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// ==============================
// Routes
// ==============================

app.get("/api/v1/test", function testRoute(_req, res) {
  return res.status(200).json({ message: "🪖 TaskFlow 🎖️" });
});

app.use("/api/v1/auth", authRouter);

app.all("*", function handleRemainingRoutes(req, res) {
  return res.status(404).json({
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});
