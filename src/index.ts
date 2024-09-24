import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

const app: Express = express();
const appPort = 3000;
const wsPort = 8080;

/* ------------------------------- Cors config ------------------------------ */
const corsOptions = {
  methods: "*",
  origin: "*",
  allowedHeaders: "*",
};
app.use(cors(corsOptions));

/* ------------------------------- Env config ------------------------------- */
dotenv.config();

/* ------------------------------ Route config ------------------------------ */
app.get("/", (req, res) => {
  res.send("Welcome to my app");
});

/* --------------------------------- Run app -------------------------------- */
app.listen(appPort, async () => {
  try {
    console.log(`http://localhost:${appPort}`);
  } catch (error) {
    console.log(error);
  }
});
