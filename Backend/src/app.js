import express from 'express';
import { sequelize } from './db/index.js';

const app = express();
app.use(express.json());

// test Postgres connection
app.get('/ping-postgres', async (req, res) => {
  try {
    const [result] = await sequelize.query('SELECT NOW() as now;');
    res.json({ status: "✅ PostgreSQL connected", time: result[0].now });
  } catch (err) {
    res.status(500).json({ status: "❌ PostgreSQL error", error: err.message });
  }
});

// test Mongo (just to confirm server runs)
app.get('/ping', (req, res) => {
  res.send("✅ Server + Mongo is running!");
});

export { app };
