import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import errorHandler from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import aichatRoutes from "./routes/aichat.routes.js";

dotenv.config({ path: ".env.local" });
const app = express();

// Tell Express it's behind a proxy (like Render) so rate limiting works correctly
app.set("trust proxy", 1);

// Global middlewares

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "https://ajani.ai/",
        "https://ajaniv3.vercel.app/",
        "http://localhost:5173",
        "http://localhost:3000",
      ].filter(Boolean); // Remove undefined values

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser, reading data from body into req.body
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiterDev = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});

const minuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const hourLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later in an hour." },
});

if (process.env.NODE_ENV === "development") {
  app.use("/api", limiterDev);
} else if (process.env.NODE_ENV === "production") {
  app.use("/api", minuteLimiter);
  app.use("/api", hourLimiter);
}

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/images", uploadRoutes);
app.use("/api/v1/ai", aichatRoutes);

app.use(errorHandler);

export default app;
