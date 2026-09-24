import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./models/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Route imports
import competitionRoutes from "./routes/competition.routes.js";
import registrationRoutes from "./routes/registration.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import winnerRoutes from "./routes/winner.routes.js";
import referralRoutes from "./routes/referral.routes.js";

dotenv.config();

const app = express();

// ─── Body Parsers ───────────────────────────────────────────────────

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ─── CORS (basic — for development) ────────────────────────────────

app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-id, x-user-role"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    if (_req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
    }
    next();
});

// ─── Health Check ───────────────────────────────────────────────────

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Feedants API is running",
        version: "1.0.0",
    });
});

// ─── API Routes ─────────────────────────────────────────────────────

app.use("/api/v1/competitions", competitionRoutes);
app.use("/api/v1/competitions/:id/register", registrationRoutes);
app.use("/api/v1/competitions/:id/submissions", submissionRoutes);
app.use("/api/v1/competitions/:id/winners", winnerRoutes);
app.use("/api/v1/referral", referralRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// ─── Global Error Handler (must be last) ────────────────────────────

app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    });

export default app;