// server.js - Main Backend Entry
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Apply Content Security Policy (CSP) before defining routes
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    );
    next();
});

// Root Route
app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/nutrition", nutritionRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 4000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Connected to DB & listening on port", PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });
