require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mariadb = require("mariadb");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
