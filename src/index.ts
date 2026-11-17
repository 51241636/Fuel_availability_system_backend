
import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/database";

import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import dns from "node:dns";

import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoute";
import stationRouter from "./routes/fuelStationRoute";
import fuelRouter from "./routes/fuelRoute";
import logOutRouter from "./routes/logOutRoute";
import paymentRouter from "./routes/paymentRoute";

dotenv.config();

// DNS Configuration
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = Number(process.env.PORT) || 3000;

const app = express();

const allowedOrigins = [
  "https://fuel-availability-system-frontend-8.vercel.app",
  "https://fuel-availability-system-frontend-8jo2-git-main-pis9.vercel.app",
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

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// API Routes
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", stationRouter);
app.use("/api", fuelRouter);
app.use("/api", logOutRouter);
app.use("/api", paymentRouter);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "PumpCheck Backend Running Successfully",
  });
});

// Error Handler
app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
);

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`PumpCheck server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
