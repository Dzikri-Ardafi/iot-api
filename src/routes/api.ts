import express, { Request, Response } from "express";
import { Db } from "mongodb";
import RequestController from "../controller/index-controller";
import { IRequestClass } from "../interface/Interface";

const router = express.Router();

const createRouter = (DbConfig: Db) => {
  // --> get current status
  router.get("/get", async (req: Request, res: Response) => {
    try {
      const params = {
        _id: "",
        dbConfig: DbConfig,
        status: false,
      } as IRequestClass;
      const ReqGetController = new RequestController(params);
      const result = await ReqGetController.dataHardware;
      res.json(result);
    } catch (error) {
      console.log(error);

      res.json({
        message: "Error",
        error,
      });
    }
  });

  //   --> update status
  router.put("/update", async (req: Request, res: Response) => {
    const { id, status } = req.query;

    try {
      const params = {
        _id: id,
        dbConfig: DbConfig,
        status: status === "true",
      } as IRequestClass;

      const ReqUpdateController = new RequestController(params);
      const result = await ReqUpdateController.updateDataHardwareHandler();
      res.json(result);
    } catch (error) {
      res.json({
        message: "Error",
        error,
      });
    }
  });

  return router;
};

export default createRouter;
