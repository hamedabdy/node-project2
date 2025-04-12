const Backup = require("node-mysql-backup");
const path = require("path"); // Import path module
const fs = require("fs");

const { dbConfig } = require("../config/database");

// Ensure backup directory exists
const backupDirectory = path.join(__dirname, "../db-backup/backup.sql");

if (!fs.existsSync(backupDirectory)) {
  fs.mkdirSync(backupDirectory, { recursive: true });
}

const connect = async () => {
  try {
    const backup = new Backup({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      backupPath: backupDirectory,
    });
  } catch (e) {
    console.log("DB BACKUP ERROR : %s", e);
  }
};

// Run backup
const runBackup = async () => {
  backup
    .dump()
    .then(() => {
      console.log("MariaDB backup completed!");
    })
    .catch((err) => {
      console.error("Backup failed:", err);
    });
};

module.exports = runBackup;
