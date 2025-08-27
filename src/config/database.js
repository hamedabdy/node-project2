require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mariadb = require("mariadb");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,           // Maximum number of connections in the pool
  connectTimeout: 10000,        // Connection timeout in milliseconds
  acquireTimeout: 10000,        // Time to wait for a connection from pool
  waitForConnections: true,     // Wait for connection if one isn't available
  queueLimit: 0,               // Maximum connection requests to queue (0 = unlimited)
  idleTimeout: 60000,          // Time a connection can be idle before being released (60 seconds)
  keepaliveInterval: 30000,    // Send keepalive packets every 30 seconds
  maxIdle: 10,                 // Maximum number of idle connections to keep
  enableKeepAlive: true        // Enable TCP keepalive
};

const pool = mariadb.createPool(dbConfig);

const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection successful!");
    
    // Handle connection errors
    connection.on('error', async (err) => {
      console.error('Database connection error:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection lost. Attempting to reconnect...');
        return await getConnection();
      } else {
        throw err;
      }
    });

    // Handle connection ending
    connection.on('end', () => {
      console.log('Database connection ended normally');
    });

    return connection;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
};

// Function to handle graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('Database connection pool closed');
  } catch (err) {
    console.error('Error closing connection pool:', err);
    throw err;
  }
};

// Add shutdown handler
process.on('SIGINT', async () => {
  try {
    await closePool();
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

module.exports = { getConnection, closePool, dbConfig };
