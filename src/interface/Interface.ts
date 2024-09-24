import { Db } from "mongodb";

interface IQueryParamsUpdate {
  _id: string;
  status: boolean;
}

export interface IResultHardware {
  _id: string;
  isOn: boolean;
  name: string;
}

export interface IRequestClass extends IQueryParamsUpdate {
  dbConfig: Db;
}
