import express from 'express';
import { sequelize } from './db/index.js';
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();
app.use(express.json({limit: "16kb"})) 

app.use(express.urlencoded({extended: true , limit:"16kb"}))  

app.use(express.static("public")) 

app.use(cookieParser())  



app.use(cors({
  origin:process.env.CORS_ORIGIN ,
  credentials:true ,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))





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
