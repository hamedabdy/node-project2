#!/bin/bash
# Restore the latest MariaDB backup from db-backup/ or server/src/db-backups/

# Default DB config (from database.js)
DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-admin}"
DB_PASSWORD="${DB_PASSWORD:-hamed}"
DB_NAME="${DB_DATABASE:-node-project}"

# Find the latest .sql file in both backup directories
BACKUP_FILE=$(ls -1t db-backup/*.sql server/src/db-backups/*.sql 2>/dev/null | head -n 1)

if [ -z "$BACKUP_FILE" ]; then
  echo "No backup file found in db-backup/ or server/src/db-backups/."
  exit 1
fi

echo "Ensuring database $DB_NAME exists on $DB_HOST..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;"

if [ $? -ne 0 ]; then
  echo "Failed to create database $DB_NAME."
  exit 1
fi

echo "Restoring backup: $BACKUP_FILE to database: $DB_NAME on $DB_HOST"

# Run the restore command
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Database restored successfully from $BACKUP_FILE."
  echo "Showing up to 10 tables in $DB_NAME to confirm restore:"
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "SHOW TABLES;" | head -n 11
else
  echo "Database restore failed."
  exit 1
fi
