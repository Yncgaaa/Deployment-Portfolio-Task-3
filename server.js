import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.static("public"));
app.use(express.json());

// connect PostgreSQL (Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// create table if not exists
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS history (
      id SERIAL PRIMARY KEY,
      expression TEXT,
      result TEXT
    );
  `);
})();

// API: save calculation
app.post("/api/save", async (req, res) => {
  const { expression, result } = req.body;

  await pool.query(
    "INSERT INTO history (expression, result) VALUES ($1, $2)",
    [expression, result]
  );

  res.json({ status: "saved" });
});

// API: get history
app.get("/api/history", async (req, res) => {
  const data = await pool.query(
    "SELECT * FROM history ORDER BY id DESC LIMIT 10"
  );

  res.json(data.rows);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});