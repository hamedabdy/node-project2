// CHALK LOGGING
const chalk = require("chalk");
const log = console.log;
const warning = chalk.bold.hex("#FFA500"); // Orange color

const { Sequelize, DataTypes } = require("sequelize");
const { v1: uuidv1, v5: uuidv5 } = require("uuid");

const { dbConfig } = require("../config/database");
const Utils = require("../utils/utils"); // Load utilies
const utils = new Utils();

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: "localhost",
    dialect: "mariadb",
    define: {
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
      createdAt: "sys_created_on",
      updatedAt: "sys_updated_on",
    },
  }
);

class Sequelizer {
  constructor(config) {
    this.sequelize = sequelize;
  }

  async testConnection() {
    // Test the connection
    this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
        return "success";
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
        return "error : " + err;
      });
  }

  // Get a list of tables
  async getTables() {
    return await this.sequelize.getQueryInterface().showAllTables();
  }

  // Get a list of tables
  async createTable(tableName) {
    // Define a model without any attributes
    const newTable = this.sequelize.define(tableName, {
      sys_id: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      sys_created_by: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      sys_updated_by: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      sys_class_name: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: tableName,
      },
    });

    // Create the table in the database
    return newTable
      .sync()
      .then(() => {
        console.log("%s has been created.", tableName);
        return { status: "success" };
      })
      .catch((error) => {
        console.log("An error occurred: ", error);
        return { status: "fail" };
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
        return {
          table: table_name,
          data: tableDefinition,
          status: "success",
          err: "",
        };
      })
      .catch((e) => {
        console.error("Get columns error : ", e);
        return { table: table_name, data: {}, status: "fail", err: e };
      });
  }

  async createColumn(tableName, columnName, length) {
    // Add a column to the table
    return this.sequelize
      .getQueryInterface()
      .addColumn(tableName, columnName, {
        type: Sequelize.DataTypes.STRING(length), // replace with the data type of the column
        allowNull: true, // replace with whether null values are allowed
      })
      .then(() => {
        console.log("Column has been added.");
        return { status: "success" };
      })
      .catch((error) => {
        console.log("An error occurred: ", error);
        return { status: "fail" };
      });
  }

  async removeColumn(tableName, columnName) {
    log(warning("table : %s --- col : %s"), tableName, columnName);
    return this.sequelize
      .getQueryInterface()
      .removeColumn(tableName, columnName)
      .then((result) => {
        console.log("Column deleted : ", result);
        return {
          table: tableName,
          column: columnName,
          status: "success",
          err: "",
        };
      })
      .catch((e) => {
        console.error("Remove Column error : ", e);
        return { table: tableName, column: columnName, status: "fail", err: e };
      });
  }

  /*
   * RECORD operations
   */
  async getRows(req) {
    const { table_name } = req.params;
    const { sys_id, sysparm_query, sysparm_count } = req.query;
    const { data } = await this.getColumns(table_name);

    // Define the model for the table
    const Model = this.sequelize.define(table_name, data);

    if (!sys_id) {
      const where = sysparm_query ? { where: { sysparm_query } } : {};
      return await Model.findAll(where)
        .then((result) => {
          return { data: result, status: "success", err: "" };
        })
        .catch((e) => {
          console.error("Get rows error : ", e);
          return { data: "", status: "fail", err: e };
        });
    }

    if (sysparm_count) {
      Model.findAndCountAll({ where: { sysparm_query } })
        .then((result) => {
          return { data: result, status: "success", err: "" };
        })
        .catch((e) => {
          console.error("Get rows error : ", e);
          return { data: "", status: "fail", err: e };
        });
    }

    if (false) {
      Model.max("attribute", {
        where: {
          sys_id: "yourSysId", // replace with your sys_id
        },
      }).then((max) => {
        console.log(max);
      });

      Model.min("attribute", {
        where: {
          sys_id: "yourSysId", // replace with your sys_id
        },
      }).then((min) => {
        console.log(min);
      });
    }

    if (sys_id) {
      return await Model.findOne({ where: { sys_id } })
        .then((result) => {
          return { data: [result], status: "success", err: "" };
        })
        .catch((e) => {
          console.error("Get rows error : ", e);
          return { data: "", status: "fail", err: e };
        });
    }
  }

  async findBySysId(Model, sys_id) {
    return await Model.findOne({ where: { sys_id } })
      .then((result) => {
        return { data: [result], status: "success", err: "" };
      })
      .catch((e) => {
        console.error("Get rows error : ", e);
        return { data: "", status: "fail", err: e };
      });
  }

  async handleRecord(req) {
    let { sys_id } = req.query;
    sys_id = utils.nil(sys_id) ? req.body.sys_id : sys_id; //either from body or query

    // if sys_id=-1 then create new record
    if (utils.nil(sys_id) || sys_id === "-1") {
      return await this.insertRow(req);
    } else {
      // Try to update an existing record
      return await this.updateRow(req);
    }
  }

  async insertRow(req) {
    const { table_name } = req.params;

    const { data } = await this.getColumns(table_name);

    // unique 32-character sys_id
    req.body.sys_id = this.generateSysID();

    // set default values for sys_ columns
    req.body.sys_updated_by = req.body.sys_created_by = "system";
    req.body.sys_updated_on = req.body.sys_created_on =
      this.sequelize.fn("NOW");

    // Define the model for the table
    const Model = this.sequelize.define(table_name, data);
    this.addHooks(Model, "create");

    // Insert the new row
    return await Model.create(req.body)
      .then((result) => {
        return { sys_id: result.dataValues.sys_id, status: "success", err: "" };
      })
      .catch((e) => {
        console.error("Insert row error : ", e);
        return { sys_id: "", status: "fail", err: e };
      });
  }

  async updateRow(req) {
    const { table_name } = req.params;
    const { sys_id } = req.body;

    const { data } = await this.getColumns(table_name);
    const Model = this.sequelize.define(table_name, data, {});

    const instance = await Model.findOne({ where: { sys_id: sys_id } });
    // No record found with the provided sys_id
    if (!instance) return [];

    this.addHooks(Model, "update");

    req.body.sys_updated_on = this.sequelize.fn("NOW");
    // TODO : convert string to datetime
    delete req.body.sys_created_on; // TEMP solution

    return await Model.update(req.body, {
      where: {
        sys_id: sys_id,
      },
      individualHooks: true,
    })
      .then(() => {
        return { sys_id: sys_id, status: "success", err: "" };
      })
      .catch((e) => {
        console.error("Update row error : ", e);
        return { sys_id: sys_id, status: "fail", err: e };
      });
  }

  async deleteRow(req) {
    const { table_name } = req.params;
    const { sys_id } = req.query;

    var { data } = await this.getColumns(table_name);

    // Define the model for the table
    const Model = this.sequelize.define(table_name, data);

    var { data } = await this.findBySysId(Model, sys_id);

    this.addHooks(Model, "bulkDelete", data);

    return await Model.destroy({ where: { sys_id: sys_id }, returning: true })
      .then((result, deletedRecords) => {
        console.log("Record deleted : %i\nRecords: %o", result, deletedRecords);
        return { sys_id: result, status: "success", err: "" };
      })
      .catch((e) => {
        console.error("Delete row error : ", e);
        return { sys_id: "", status: "fail", err: e };
      });
  }

  //// HELPER METHODS
  generateSysID() {
    // Generate a UUIDv1
    const uuidv1Output = uuidv1().replace(/-/g, "");
    // Use the output of UUIDv1 as the input for UUIDv5
    return uuidv5(uuidv1Output, uuidv5.DNS).replace(/-/g, "");
  }

  addHooks(Model, operation, records) {
    switch (operation) {
      case "create":
        Model.addHook("beforeCreate", (model, options) => {
          // TODO : add before business rules
          // log(warning("table : ", model.getTableName()));
          // if (model.getTableName()) log(warning("operation: ", operation));
        });
        Model.addHook("afterCreate", (model, options) => {
          // TODO : add after business rules
          log(
            warning("Running afterupdate hook for table : %s, %o"),
            model.get("sys_class_name"),
            options
          );

          this.createColumn(
            model.get("sys_class_name"),
            model.get("name"),
            model.get("length")
          );
        });
        break;
      case "update":
        log(warning("inside addhooks : %s"), Model.getTableName());
        Model.addHook("beforeUpdate", (model, options) => {
          // TODO : add before business rules
          log(
            warning("Running beforeupdate hook for table : %s, %o"),
            Model.getTableName(),
            options
          );
        });
        Model.addHook("afterUpdate", (model, options) => {
          // TODO : add after business rules
          log(
            warning("Running afterupdate hook for table : %s"),
            model.get("sys_class_name")
          );
          this.createColumn(
            model.get("sys_class_name"),
            model.get("name"),
            model.get("length")
          );
        });
        break;
      case "delete":
        Model.addHook("beforeDestroy", (model, options) => {
          // TODO : add before business rules
          log(
            warning("Running beforeDestroy hook for table : %s"),
            model.get("sys_class_name")
          );
        });
        Model.addHook("afterDestroy", (model, options) => {
          // TODO : add after business rules
          log(
            warning("Running afterDestroy hook for table : %o, %o"),
            model,
            options
          );
        });
        break;
      case "bulkDelete":
        Model.addHook("beforeBulkDestroy", (model, options) => {
          // TODO : add before business rules
          // log(warning("Running beforeBulkDestroy hook for table : %o"), model);
        });
        Model.addHook("afterBulkDestroy", async (model, options) => {
          const record = records.pop();
          // TODO : add after business rules
          log(
            warning("Running afterBulkDestroy hook for table : %s"),
            record.sys_class_name
          );
          this.removeColumn(record.sys_class_name, record.name);
        });
        break;
      default:
        break;
    }
  }
}

module.exports = Sequelizer;
