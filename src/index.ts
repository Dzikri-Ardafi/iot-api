import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors, { CorsOptions } from "cors";
import dbConnectionHandler from "./utils/dbConnectionHandler";
import createRouter from "./routes/api";
import { Db } from "mongodb";
import ws from "ws";
import path from "path";

const app: Express = express();
const appPort = process.env.PORT || 3000;
const wsPort = process.env.PORT_WS || (8080 as any);

/* ---------------------------- Ejs views config ---------------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.use("/", (req, res) => {
  res.render("index");
});

/* --------------------------------- Run app -------------------------------- */
app.listen(appPort, async () => {
  try {
    await dbConnectionHandler.connectDBHandler();
    console.log(`Ws port`, wsPort);

    console.log(`http://localhost:${appPort}`);
  } catch (error) {
    console.log(error);
  }
});
