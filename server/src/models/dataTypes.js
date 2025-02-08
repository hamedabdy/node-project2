const { DataTypes } = require("sequelize");

const sequelizeDataTypes = {
  string: (max_length) => DataTypes.STRING(max_length),
  integer: (max_length) => DataTypes.INTEGER(max_length),
  boolean: DataTypes.BOOLEAN,
  date: (max_length) => DataTypes.DATEONLY(max_length),
  datetime: (max_length) => DataTypes.DATE(max_length),
  collection: DataTypes.STRING,
  choice: (max_length) => DataTypes.STRING(max_length),
};

module.exports = sequelizeDataTypes;
