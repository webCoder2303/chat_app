import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js"

dotenv.config()
const app = express()
const server = http.createServer(app)

//Middleware Setup
app.use(express.json({limit:"4mb"}))
app.use(cors())

app.use("/api/status",(req,res)=>{
    res.send("Server is running")
})


//Connect to MongoDB
await connectDB();

const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>{
    console.log("Server is running on Port "+PORT)
})