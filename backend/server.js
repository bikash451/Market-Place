import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import sql from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";

// Load .env from backend/.env (even if script is started from root)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet()); // security middleware
app.use(morgan("dev")); // log incoming requests

app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Too Many Requests" });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ error: "Bot access denied" });
            } else {
                return res.status(403).json({ error: "Forbidden" });
            }
        }

        if (
            decision.results.some(
                (result) =>
                    result.reason.isBot() && result.reason.isSpoofed()
            )
        ) {
            return res.status(403).json({ error: "Spoofed bot detected" });
        }

        next();
    } catch (error) {
        console.error("Arcjet error", error);
        next();
    }
});

app.use("/api/products", productRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// Initialize database and start server
async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error in initDB", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log("ENV USER:", process.env.DB_USER); // for debug
    });
});
