const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const DBConnect = require("./Config/db");
const authRoute = require("./routes/authRoute");
const notesRoutes =require("./routes/notesRoutes")
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: false
}));

// Routes
app.use('/api/notes', notesRoutes);
app.use('/api/user', authRoute);

// Connect to DB and start server
(async () => {
  try {
    const mongoString = process.env.MONGOSTRING;
    await DBConnect(mongoString);

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
})();
