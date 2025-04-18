/**
 * @fileoverview This is the main server file for the Notes API.
 * The server is built using Express.js and connects to a MongoDB database.
 * It includes authentication routes, notes routes, and other middleware for handling requests.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DBConnect } from './Config/db.js';
import authRoute from './routes/authRoute.js';
import notesRoutes from './routes/notesRoutes.js';
import cookieParser from 'cookie-parser';

// Configure environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/**
 * Middleware configuration for the server.
 * - Express JSON parser for parsing request bodies.
 * - Cookie parser for handling cookies.
 * - CORS for enabling cross-origin requests.
 */
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: '*',  // Allow all origins for CORS
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],  // Allowed HTTP methods
  credentials: true,  // Allow credentials to be included in requests
}));

// Define Routes
/**
 * Routes for managing notes
 * @route {GET|POST|PATCH|PUT|DELETE} /api/notes
 */
app.use('/api/notes', notesRoutes);

/**
 * Routes for authentication and user management
 * @route {POST} /api/user/login
 * @route {POST} /api/user/register
 */
app.use('/api/user', authRoute);

/**
 * Function to connect to the MongoDB database and start the server.
 * If the connection is successful, the server starts listening on the specified port.
 * @async
 * @function startServer
 * @returns {void}
 */
(async () => {
  try {
    const mongoString = process.env.MONGOSTRING;  // Database connection string from environment variables
    await DBConnect(mongoString);  // Connect to the MongoDB database

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    // Log any errors that occur during the server startup
    console.error('Failed to start server:', error.message);
  }
})();
