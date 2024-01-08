const mariadb = require("mariadb");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "hamed",
  database: process.env.DB_DATABASE || "node-project",
};

const pool = mariadb.createPool(dbConfig);

const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection successful!");
    connection.release();
    return connection;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
};

module.exports = { getConnection, dbConfig };
