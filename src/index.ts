import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/database";
import userRouter from "../src/routes/userRoutes";
// var cors = require('cors')
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/authRoute";
import stationRouter from "./routes/fuelStationRoute";
import fuelRouter from "./routes/fuelRoute";
import logOutRouter from "./routes/logOutRoute";
import path from "path";
import paymentRouter from "./routes/paymentRoute";
import dns from "node:dns";

// DNS Configuration
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGO_URL = process.env.MONGO_URI || "";
const PORT: number = Number(process.env.PORT) || 3000;

const app = express();
const allowedOrigins = [
  "https://fuel-availability-system-frontend.vercel.app",
  "https://fuel-availability-system-frontend-z5og-7ichj0qeu-pis9.vercel.app",
  "http://localhost:5173",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

connectDB();

app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", stationRouter);
app.use("/api", fuelRouter);
app.use("/api", logOutRouter);
app.use("/api", paymentRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(500).json({ message: err.message });
});

// connectDB();
// app.use("/api",)

app.listen(process.env.PORT, () => {
  console.log("Server running on port 3000");
});