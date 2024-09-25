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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class RequestController {
    constructor(params) {
        this.dbConfig = params.dbConfig;
        this.id = params._id;
        this.status = params.status;
        this.collection = this.dbConfig.collection("hardware");
        this.singleCollection = this.dbConfig.collection("hardware");
        this.objectId = params._id ? new mongodb_1.ObjectId(params._id) : "";
    }
    // --> getter
    get dataHardware() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = (yield this.getDataHardwareHandler());
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    // --> get method
    getDataHardwareHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.collection
                        .find({})
                        .toArray();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    // --> update status
    updateDataHardwareHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const query = {
                        _id: this.objectId,
                    };
                    const selectedHardware = (yield this.singleCollection.findOne(query));
                    if (selectedHardware) {
                        const statusBool = this.status;
                        if (selectedHardware.isOn === statusBool) {
                            resolve({
                                status: 304,
                                message: "No data changes",
                                isOn: selectedHardware.isOn,
                            });
                        }
                        else {
                            const queryUpdate = {
                                $set: {
                                    isOn: this.status,
                                },
                            };
                            yield this.singleCollection.findOneAndUpdate(query, queryUpdate);
                            const selectedHardware = (yield this.singleCollection.findOne(query));
                            resolve({
                                status: 201,
                                message: "Data Changed",
                                isOn: selectedHardware.isOn,
                            });
                        }
                    }
                    else {
                        reject({
                            message: "Id Not found",
                            status: 404,
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                    reject({
                        message: "Internal Server Error",
                        status: 500,
                    });
                }
            }));
        });
    }
}
exports.default = RequestController;
