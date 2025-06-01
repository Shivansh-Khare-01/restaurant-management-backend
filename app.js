const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const app = express();
app.use(cors());
app.use(express.json());

require("./models/db");

app.use(cors());

const menuItemRoutes = require("./routes/menuItemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chefRoutes = require("./routes/chefRoutes");
const tableRoutes = require("./routes/tableRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// API routes
app.use("/api/v1/menu", menuItemRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/chefs", chefRoutes);
app.use("/api/v1/tables", tableRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Handle undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

module.exports = { app };
