import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors, { CorsOptions } from "cors";
import dbConnectionHandler from "./utils/dbConnectionHandler";
import createRouter from "./routes/api";
import { CollectionInfo, Db } from "mongodb";

const app: Express = express();
const appPort = 3000;
const wsPort = 8080;

/* ------------------------------- Cors config ------------------------------ */
const corsOptions = {
  methods: "*",
  origin: "*",
  allowedHeaders: "*",
  credentials: false,
  exposedHeaders: "*",
} as CorsOptions;
app.use(cors(corsOptions));

/* ------------------------------ Route config ------------------------------ */
const db = dbConnectionHandler.dbClient.db("iot") as Db;
app.use("/api", createRouter(db));
app.get("/", (req, res) => {
  res.send("Welcome to my app");
});

/* --------------------------------- Run app -------------------------------- */
app.listen(appPort, async () => {
  try {
    await dbConnectionHandler.connectDBHandler();
    console.log(`http://localhost:${appPort}`);
  } catch (error) {
    console.log(error);
  }
});
