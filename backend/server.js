import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const app = express();
app.use(cors());

const fallbackData = [
  { id: 1, name: "Preset A" },
  { id: 2, name: "Preset B" }
];

app.get("/api/items", async (req, res) => {
  try {
    const [rows] = await conn.execute(`
      SELECT 
        item_id AS id,
        item_name AS name,
        item_type AS type,
        item_rarity AS rarity,
        item_lore AS lore
      FROM item
    `);
    res.json({ source: "mysql", data: rows });
  } catch (err) {
    console.error("Items error:", err);
    res.json({ source: "fallback", data: [] });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const [rows] = await conn.execute(`
      SELECT 
        event_id AS id,
        event_name AS name,
        event_description AS description,
        event_type AS type,
        event_impact AS impact,
        world_id AS world
      FROM event_table
    `);
    res.json({ source: "mysql", data: rows });
  } catch (err) {
    console.error("Events error:", err);
    res.json({ source: "fallback", data: [] });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
