// Load environment variables from .env file
require("dotenv").config();

const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
// const debug = require("debug");
// const inflect = require("i");

// const { getConnection } = require("./src/config/database");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorMiddleware");
const routes = require("./routes/index");

// Enable debug logging for Express.js
// debug("express:router");
// debug("express:application");

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// Use Morgan middleware for logging HTTP requests
app.use(morgan("dev"));

app.use(cors()); // Enable CORS

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/ping', (req, res) => {
  res.json({ status: 'pong', timestamp: new Date().toISOString() });
});

app.use("/api", routes);

// Handle 404 errors
app.use(notFoundHandler);

// Handle other errors
app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
