import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import { dbConnection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import timelineRouter from "./routes/timelineRouter.js";
import messageRouter from "./routes/messageRouter.js";
import skillRouter from "./routes/skillRouter.js";
import softwareApplicationRouter from "./routes/softwareApplicationRouter.js";
import projectRouter from "./routes/projectRouter.js";

dotenv.config({ path: "./config/config.env" }); // Load environment variables

const app = express();

// Enable CORS for specific origins
app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL], // Replace with your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Enable cookies across origins
  })
);

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for handling file uploads
app.use(
  fileUpload({
    useTempFiles: true, // Enable temporary files
    tempFileDir: "/tmp/", // Directory for temporary files
  })
);

// Route definitions
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/project", projectRouter);

// Connect to the database
dbConnection();

// Error handling middleware
app.use(errorMiddleware);

// Default route (optional for health check or welcome message)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API!",
  });
});

// Handle undefined routes (optional)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
