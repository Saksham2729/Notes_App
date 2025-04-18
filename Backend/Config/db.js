import mongoose from "mongoose";
import { DB_NAME } from "../contant.js";

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * @async
 * @function DBConnect
 * @param {string} UrlString - The MongoDB connection URI.
 * @throws {Error} Throws an error if the connection string is missing or if the connection fails.
 * @returns {Promise<void>} A promise that resolves when the connection is successfully established.
 *
 * @example
 * DBConnect("mongodb://localhost:27017")
 *   .then(() => console.log("Connected to MongoDB"))
 *   .catch(err => console.error("Connection error:", err));
 */
export const DBConnect = async (UrlString) => {
  try {
    if (!UrlString) {
      throw new Error("MongoDB connection string is missing.");
    }

    await mongoose.connect(UrlString, { dbName: DB_NAME });
  } catch (err) {
    throw err;
  }
};
