const { DataTypes } = require("sequelize");

const sequelizeDataTypes = {
  string: DataTypes.STRING,
  integer: DataTypes.INTEGER,
  boolean: DataTypes.BOOLEAN,
  date: DataTypes.DATEONLY,
  datetime: DataTypes.DATE,
  collection: DataTypes.STRING,
  choice: DataTypes.STRING,
};

module.exports = sequelizeDataTypes;
