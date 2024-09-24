import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors, { CorsOptions } from "cors";
import dbConnectionHandler from "./utils/dbConnectionHandler";
import createRouter from "./routes/api";
import { CollectionInfo, Db } from "mongodb";
import ws from "ws";

const app: Express = express();
const appPort = process.env.PORT || 3000;
const wsPort = process.env.PORT_WS || (8080 as any);

/* ------------------------------- Cors config ------------------------------ */
const corsOptions = {
  methods: "*",
  origin: "*",
  allowedHeaders: "*",
  credentials: false,
  exposedHeaders: "*",
} as CorsOptions;
app.use(cors(corsOptions));

/* ---------------------------- Websocket config ---------------------------- */
const wss = new ws.Server({
  port: wsPort,
});

wss.on("connection", (websocket) => {
  console.log("A new client connected");

  // --> incomming message
  websocket.on("message", (message) => {
    console.log("Received message:", message.toString());

    // --> send message to all connected client
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send("Hello from server");
      }
    });
  });

  // --> client disconnected
  websocket.on("close", () => {
    console.log("A client disconnected");
  });
});

/* ------------------------------ Route config ------------------------------ */
const db = dbConnectionHandler.dbClient.db("iot") as Db;
app.use("/api", createRouter(db));

/* --------------------------------- Run app -------------------------------- */
app.listen(appPort, async () => {
  try {
    // await dbConnectionHandler.connectDBHandler();
    console.log(`Ws port`, wsPort);

    console.log(`http://localhost:${appPort}`);
  } catch (error) {
    console.log(error);
  }
});
