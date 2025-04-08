import Logger from "./utils/Logger.js";
import InitializeApp from "./utils/InitializeApp.js";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import contactsRoutes from './routes/contactsRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000; // Change the default port to 4000

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable credentials for cookies
}));

app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Match frontend origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Handle preflight requests
  }
  next();
});

app.use('/api/contacts', contactsRoutes);

Logger.setup(app);

InitializeApp.init(app)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      Logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Initialization error:", error);
    Logger.error("Initialization error:" + error);
  });