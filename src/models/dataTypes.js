const { DataTypes } = require("sequelize");

const sequelizeDataTypes = {
  string: (max_length) => DataTypes.TEXT,
  integer: () => DataTypes.INTEGER,
  decimal: (max_length) => DataTypes.DECIMAL(max_length, 2),
  boolean: () =>  DataTypes.BOOLEAN,
  date: () =>  DataTypes.DATEONLY,
  datetime: () =>  DataTypes.DATE,
  GUID: () =>  DataTypes.UUID, // generic version (CHAR(36))
  collection: (max_length) => DataTypes.STRING(max_length), // store as string (table name)
  reference: () =>  DataTypes.STRING(32), // store as string (sys_id)
  table_name: () =>  DataTypes.STRING(80),
  choice: () => DataTypes.STRING(40),
  html: (max_length) => DataTypes.STRING(max_length),
  text: () => DataTypes.TEXT,
  script: () => DataTypes.TEXT,
};

module.exports = sequelizeDataTypes;


/** TODO:
 * - add child data types (ex: System class name, Version)
 */