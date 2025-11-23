import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/KrishiSathi`
    );
    console.log("mongoDB connect successfully :", conn.connection.host);
  } catch (error) {
    console.log("error in mongodb connection", error);
  }
};

export default connectDB;
