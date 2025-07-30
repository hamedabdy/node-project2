const { getConnection } = require("../config/database");

const databaseMiddleware = async (req, res, next) => {
  try {
    const connection = await getConnection();
    req.db = connection;
    next();
  } catch (err) {
    console.error("Error connecting to the database:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = databaseMiddleware;
