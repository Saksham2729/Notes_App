// dbConnect.js

const mongoose = require("mongoose");
const { DB_NAME } = require("../contant");

const DBConnect = async (UrlString) => {
  try {
    if (!UrlString) {
      throw new Error("MongoDB connection string is missing.");
    }

    await mongoose.connect(UrlString, { dbName: DB_NAME });
    console.log("✅ DB connected successfully");
  } catch (err) {
    console.error("❌ Error while connecting to DB:", err.message);
    throw err;
  }
};

module.exports = DBConnect;
