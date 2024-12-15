import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import errorLogger from "./middlewares/errorLogger";

import cluster from "cluster";
import os from "os";
require("dotenv").config();
// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define static folder for serving uploaded files (e.g., images)
app.use("/uploads", express.static("uploads"));

// Define a root route
app.get("/", (req, res) => {
    res.send(`Welcome to the Node.js MVC Server! PID: ${process.pid}`);
});

// Versioned routes
app.use("/api/v1", routes);

// Error logging middleware
app.use(errorLogger);

// General error handler middleware
app.use(errorHandler);

export default app;
