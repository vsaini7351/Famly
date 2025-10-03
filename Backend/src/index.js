//  import dotenv from 'dotenv'
//  dotenv.config({
//     path: './.env'
// }) 

// import {app} from './app.js'
// import {connectDB} from './db/index.js'

// connectDB()
// .then(()=>{
//     app.on("error",(err)=>{
//         console.log("Err: ",err);
//         throw err;
//     })
//     app.listen(process.env.PORT || 8000, ()=>{
//         console.log(`Server is running at port : ${process.env.PORT}`);
//     }) 
// })
// .catch((err)=>{
//     console.log("MongoDb connection failed: ",err);
// })


import dotenv from "dotenv";
dotenv.config({
    path: './.env' });

import { app } from "./app.js";
import { connectMongo, connectPostgres } from "./db/index.js";

const startServer = async () => {
  try {
    await connectMongo();
    await connectPostgres();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();