import mongoose from "mongoose";

// Function to connect to MongoDB database
export const connectDB = async () => {
  try {
    // Log when MongoDB connection is successful
    mongoose.connection.on("connected", () =>
      console.log("Database connected")
    );

    // Connect to MongoDB using environment URI
    await mongoose.connect(process.env.MONGO_URI);

  } catch (error) {
    console.log(error);
  }
};