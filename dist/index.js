"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const dbConnectionHandler_1 = __importDefault(require("./utils/dbConnectionHandler"));
const api_1 = __importDefault(require("./routes/api"));
const ws_1 = __importDefault(require("ws"));
const app = (0, express_1.default)();
const appPort = process.env.PORT || 3000;
const wsPort = process.env.PORT_WS || 8080;
/* ------------------------------- Cors config ------------------------------ */
const corsOptions = {
    methods: "*",
    origin: "*",
    allowedHeaders: "*",
    credentials: false,
    exposedHeaders: "*",
};
app.use((0, cors_1.default)(corsOptions));
/* ---------------------------- Websocket config ---------------------------- */
const wss = new ws_1.default.Server({
    port: wsPort,
});
wss.on("connection", (websocket) => {
    console.log("A new client connected");
    // --> incomming message
    websocket.on("message", (message) => {
        console.log("Received message:", message.toString());
        // --> send message to all connected client
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
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
const db = dbConnectionHandler_1.default.dbClient.db("iot");
app.use("/api", (0, api_1.default)(db));
/* --------------------------------- Run app -------------------------------- */
app.listen(appPort, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbConnectionHandler_1.default.connectDBHandler();
        console.log(`Ws port`, wsPort);
        console.log(`http://localhost:${appPort}`);
    }
    catch (error) {
        console.log(error);
    }
}));
