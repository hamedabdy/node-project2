const { Sequelize } = require("sequelize");

class SchemaManager {
  constructor(sequelizeCon, sysDbObject) {
    this.sequelize = sequelizeCon;
    this.sysDbObject = sysDbObject;
  }

  async testConnection() {
    // Test the connection
    return await this.sequelize
      .authenticate()
      .then(() => {
        return {response : "success"}
      })
      .catch((err) => {
        return {response : "error : " + err};
      });
  }

  // Get a list of tables
  async getTables() {
    return await this.sequelize.getQueryInterface().showAllTables();
  }

  // Get the structure of a table
  async getTableInfo(table_name) {
    return await this.sysDbObject
      .findOne({ where: { name: table_name } })
      .then((result) => {
        return { data: result, status: "success" };
      })
      .catch((e) => {
        console.error("[SEQUELIZE] Get table info error : ", e);
        return { data: {}, status: "fail", err: e };
      });
  }

  // Delete a table from DB
  async dropTable(tableName) {
    return await this.sequelize
      .getQueryInterface()
      .dropTable(tableName)
      .then(() => {
        console.log("Table has been dropped: ", tableName);
        return { status: "success" };
      })
      .catch((error) => {
        console.log("An error occurred: ", error);
        return { status: "fail" };
      });
  }

  async getColumns(table_name) {
    return await this.sequelize.queryInterface
      .describeTable(table_name)
      .then((tableDefinition) => {
        return {table: table_name, data: tableDefinition, status: "success"};
      })
      .catch((e) => {
        console.error("Get columns error : ", e);
        return { table: table_name, data: {}, status: "fail", err: e };
      });
  }
}

module.exports = SchemaManager;