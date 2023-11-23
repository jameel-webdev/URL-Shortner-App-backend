import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDb Connected Successfully`);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit(1);
  }
};
