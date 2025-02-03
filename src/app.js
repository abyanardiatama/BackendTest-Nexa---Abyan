require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get("/check-db", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT NOW() as now");
      res.json({ message: "Database connected", time: rows[0].now });
    } catch (err) {
      res.status(500).json({ error: "Database connection failed" });
    }
  });

app.get("/", (req, res) => {
  res.send("Backend Test Nexa API Running...");
});

app.use("/api/auth", authRoutes);

app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
