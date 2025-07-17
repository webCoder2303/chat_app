import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"

const app = express()
const server = http.createServer(app)

//Middleware Setup