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
const index_controller_1 = __importDefault(require("../controller/index-controller"));
const router = express_1.default.Router();
const createRouter = (DbConfig) => {
    // --> get current status
    router.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const params = {
                _id: "",
                dbConfig: DbConfig,
                status: false,
            };
            const ReqGetController = new index_controller_1.default(params);
            const result = yield ReqGetController.dataHardware;
            res.json(result);
        }
        catch (error) {
            console.log(error);
            res.json({
                message: "Error",
                error,
            });
        }
    }));
    //   --> update status
    router.put("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, status } = req.query;
        try {
            const params = {
                _id: id,
                dbConfig: DbConfig,
                status: status === "true",
            };
            const ReqUpdateController = new index_controller_1.default(params);
            const result = yield ReqUpdateController.updateDataHardwareHandler();
            res.json(result);
        }
        catch (error) {
            res.json({
                message: "Error",
                error,
            });
        }
    }));
    return router;
};
exports.default = createRouter;
