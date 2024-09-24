import { Collection, Db, ObjectId, UpdateFilter, WithId } from "mongodb";
import { IRequestClass, IResultHardware } from "../interface/Interface";

class RequestController {
  dbConfig: IRequestClass["dbConfig"];
  id: IRequestClass["_id"];
  status: IRequestClass["status"];
  collection: Collection<IResultHardware[]>;
  singleCollection: Collection<IResultHardware>;
  objectId: ObjectId | string;

  constructor(params: IRequestClass) {
    this.dbConfig = params.dbConfig;
    this.id = params._id;
    this.status = params.status;
    this.collection = this.dbConfig.collection("hardware");
    this.singleCollection = this.dbConfig.collection("hardware");
    this.objectId = params._id ? new ObjectId(params._id) : "";
  }

  // --> getter
  get dataHardware() {
    return new Promise(async (resolve, reject) => {
      try {
        const result =
          (await this.getDataHardwareHandler()) as IResultHardware[];
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // --> get method
  async getDataHardwareHandler() {
    return new Promise(async (resolve, reject) => {
      try {
        const result: WithId<IResultHardware[]>[] = await this.collection
          .find({})
          .toArray();

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // --> update status
  async updateDataHardwareHandler() {
    return new Promise(async (resolve, reject) => {
      try {
        const query = {
          _id: this.objectId,
        } as any;

        const selectedHardware = (await this.singleCollection.findOne(
          query
        )) as IResultHardware;

        if (selectedHardware) {
          const statusBool = this.status;
          if (selectedHardware.isOn === statusBool) {
            resolve({
              status: 304,
              message: "No data changes",
              isOn: selectedHardware.isOn,
            });
          } else {
            const queryUpdate = {
              $set: {
                isOn: this.status,
              },
            } as UpdateFilter<IResultHardware>;

            await this.singleCollection.findOneAndUpdate(query, queryUpdate);
            const selectedHardware = (await this.singleCollection.findOne(
              query
            )) as IResultHardware;
            resolve({
              status: 201,
              message: "Data Changed",
              isOn: selectedHardware.isOn,
            });
          }
        } else {
          reject({
            message: "Id Not found",
            status: 404,
          });
        }
      } catch (error) {
        console.log(error);

        reject({
          message: "Internal Server Error",
          status: 500,
        });
      }
    });
  }
}

export default RequestController;
