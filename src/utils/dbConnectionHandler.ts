import { MongoClient } from "mongodb";

const dbUri = process.env.ATLAS_URI as string;

console.log(dbUri);

const dbClient = new MongoClient(dbUri);

// --> Function to connect to dabatabase
const connectDBHandler = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await dbClient.connect();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  connectDBHandler,
  dbClient,
};
