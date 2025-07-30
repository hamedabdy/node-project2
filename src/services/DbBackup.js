const path = require("path"); // Import path module
const fs = require("fs");
const { exec } = require("child_process");

const { dbConfig } = require("../config/database");

// Ensure backup directory exists
const backupDirectory = path.join(__dirname, "../db-backups");

if (!fs.existsSync(backupDirectory)) {
  fs.mkdirSync(backupDirectory, { recursive: true });
}

// Run backup
// Pass true to append date to filename, false otherwise
const runBackup = async (appendDate = false) => {
  try {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = appendDate ? `backup${dateStr}.sql` : `backup.sql`;
    const backupFile = path.join(backupDirectory, filename);

    const dumpCmd = `mysqldump -u${dbConfig.user} -p${dbConfig.password} -h${dbConfig.host} ${dbConfig.database} > ${backupFile}`;

    await new Promise((resolve, reject) => {
      exec(dumpCmd, (error, stdout, stderr) => {
        if (error) {
          console.error("Backup failed:", error);
          reject(error);
        } else {
          console.log(`MariaDB backup completed! Saved to ${backupFile}`);
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("Backup failed:", err);
  }
};

module.exports = runBackup;
