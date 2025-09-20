const { Sequelize, DataTypes, Op } = require("sequelize");

const { dbConfig } = require("../config/database");
const utils = new (require("../utils/utils"))(); // Load utilies
const query_litteral = new (require("../utils/QueryLitteral"))();

// IMPORT MODELS
const SysMetaData = require("../models/SysMetaData");
const SysGlideObject = require("../models/SysGlideObject");
const SysDictionary = require("../models/SysDictionary");
const SysDbObject = require("../models/SysDbObject");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "mariadb",
    logging: false, // utils.warn,
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
    this.sysMetaData = SysMetaData(this.sequelize);
    this.sysGlideObject = SysGlideObject(this.sequelize, this.sysMetaData);
    this.sysDictionary = SysDictionary(this.sequelize, this.sysMetaData, this.sysGlideObject);
    this.sysDbObject = SysDbObject(this.sequelize, this.sysMetaData, this.sysDictionary);
    this.sequelize.sync({ alter: true, force: false });
    // alter : true => Sequelize automatically updates the database schema to match the model definitions without dropping existing tables.
    // force : true => Drops everything and recreates everything.
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

  async getFields(table_name) {
    return await this.sysDictionary
      .getAttribs(table_name)
      .then((rows) => {
        return {table: table_name, data: rows, status: "success"};
      })
      .catch((e) => {
        console.error("Get columns error : ", e);
        return { table: table_name, data: {}, status: "fail", err: e };
      });
  }

  /** RECORD operations
   * @param {Object} req request object must contain table_name in params
   */
  async getRows(req) {
    const { table_name } = req.params;
    const { sys_id, sysparm_query, sysparm_limit, sysparm_fields } = req.query;
    
    // Get the appropriate model
    const Model = await this.getTableMapping(table_name);

    if (!sys_id) {
      let query = {};
      if (!sysparm_query) {
        console.log("No query parameters provided.");
      } else {
        const q = query_litteral.encodedQueryToSequelize(sysparm_query);
        query = { where: q };
        if (parseInt(sysparm_limit)) query.limit = parseInt(sysparm_limit);

        console.log("Filtered Query: %o", query);
      }

      // If sysparm_fields is provided, use it as the attributes option
      if (sysparm_fields) {
        query.attributes = sysparm_fields.split(",").map(f => f.trim()).filter(Boolean);
      }

      return await Model.findAll(query)
        .then((result) => {
          return { data: result, status: "success" };
        })
        .catch((e) => {
          console.error("Get rows error : ", e);
          return { data: [], status: "fail", err: e };
        });
    }

    if (sys_id) return this.findBySysId(Model, sys_id);
  }

  /**
   * Queries the database for a given table name and sys_id to return the sys_name value.
   * @param {string} tableName The name of the table to query.
   * @param {string} sys_id The sys_id of the record to retrieve.
   * @returns {Promise<Object>} An object containing the sys_name value or an error.
   */
  async getSysNameBySysId(tableName, sys_id) {
    try {
      const Model = await this.getTableMapping(tableName);
      const result = await Model.findByPk(sys_id, {
        attributes: ['sys_name']
      });
      if (result) {
        return { data: result.sys_name, status: "success" };
      } else {
        return { data: null, status: "fail", err: "Record not found" };
      }
    } catch (e) {
      console.error(`[SEQUELIZER] Error getting sys_name for table ${tableName}, sys_id ${sys_id}: `, e);
      return { data: null, status: "fail", err: e.message };
    }
  }

  async findBySysId(Model, sys_id) {
    return await Model.findByPk(sys_id)
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

  /**
   *
   * @param {object} req Request object of the api containing table_name in req.params
   * @returns promise
   */
  async insertRow(req) {
    const { table_name } = req.params;

    // unique 32-character sys_id
    req.body.sys_id = utils.generateSysID();

    // set default values for sys_ columns
    req.body.sys_updated_by = req.body.sys_created_by = "system";
    req.body.sys_updated_on = req.body.sys_created_on =
      this.sequelize.fn("NOW");

    // Find the display field from sys_dictionary
    const displayField = await this.sysDictionary.findOne({
      where: {
        name: table_name,
        display: true
      }
    });

    // Set sys_name based on display field if available, otherwise fallback to name field
    req.body.sys_name = displayField ? req.body[displayField.element] : req.body.name;
    req.body.sys_mod_count = "0";
    req.body.sys_update_name = `${table_name}_${req.body.sys_id}`;
    req.body.sys_class_name = table_name; // Set sys_class_name to table name by default

    // Get speccific or generic Model
    const Model = await this.getTableMapping(table_name);

    // Insert the new row
    return await Model.create(req.body)
      .then((result) => {
        if (!utils.nil(result))
          return { sys_id: result.dataValues.sys_id, status: "success" };
      })
      .catch((e) => {
        console.error("SEQUELIZER - Insert row error : ", e);
        return { sys_id: "", status: "fail", err: e };
      });
  }

  async updateRow(req) {
    const { table_name } = req.params;
    const { sys_id } = req.body;

    // Get speccific or generic Model
    const Model = await this.getTableMapping(table_name);

    const instance = await Model.findByPk(sys_id);
    if (!instance)
      return { sys_id: "", status: "fail", err: "Record not found" };

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
        return { sys_id: sys_id, status: "success" };
      })
      .catch((e) => {
        console.error("Update row error : ", e);
        return { sys_id: sys_id, status: "fail", err: e };
      });
  }

  async deleteRow(req) {
    const { table_name } = req.params;
    const record = req.query; // needs sanitization to prevent SQL / HTML injection

    // Get speccific or generic Model
    const Model = await this.getTableMapping(table_name);

    return await Model.destroy({
      where: record,
      individualHooks: true,
      no_count: false,
    })
      .then(() => {
        console.log("\n%s - Record deleted : %o\n", table_name, record);
        return { record: record, status: "success" };
      })
      .catch((e) => {
        console.error("\n%s - Delete row error : %s", table_name, e);
        return { record: record, status: "fail", err: e };
      });
  }

  ///////
  addHooks(Model, operation, records) {
    switch (operation) {
      case "create":
        Model.addHook("beforeCreate", (model, options) => {
          // TODO : add before business rules
        });
        Model.addHook("afterCreate", (model, options) => {
          // TODO : add after business rules
          // log(warning("Running afterCreate hook for table : %s, %o"), model.get("sys_class_name"), options);
          // switch (model.get("sys_class_name")) {
          //   case "sys_dictionary":
          //     this.sysDictionary.create(model.get("table"), model.get("name"),model.get("length"));
          //     break;

          //   case "sys_db_object":
          //     this.sysDbObject.createTableIfNotExists(model); //this.createTable(model.get("name"));
          //     break;
          //   default:
          //     break;
          // }
        });
        break;
      case "update":
        log(warning("inside addhooks : %s"), Model.getTableName());
        Model.addHook("beforeUpdate", (model, options) => {
          // TODO : add before business rules
          log(warning("Running beforeupdate hook for table : %s, %o"), Model.getTableName(), options);
        });
        Model.addHook("afterUpdate", (model, options) => {
          // TODO : add after business rules
          log(warning("Running afterupdate hook for table : %s"), model.get("sys_class_name"));
        });
        break;
      case "delete":
        Model.addHook("beforeDestroy", (model, options) => {
          // TODO : add before business rules
          log(warning("Running beforeDestroy hook for table : %s"), model.get("sys_class_name"));
        });
        Model.addHook("afterDestroy", (model, options) => {
          // TODO : add after business rules
          log(warning("Running afterDestroy hook for table : %o, %o"), model, options);
        });
        break;
      case "bulkDelete":
        Model.addHook("beforeBulkDestroy", (model, options) => {
          // TODO : add before business rules
          // log(warning("Running beforeBulkDestroy hook for table : %o"), model);
        });
        Model.addHook("afterBulkDestroy", async (model, options) => {
          // TODO : add after business rules
          log(warning("Running afterBulkDestroy hook for table : %s"), record.sys_class_name);
          // const record = records.pop();
        //   if (record.sys_class_name === "sys_dictionary")
        //     this.removeColumn(record.sys_class_name, record.name); // CHECK THIS TO SEE IF IT IS DUPLICATE WITH SYS_DB_OBJECT
        });
        break;
      default:
        break;
    }
  }

  async getTableMapping(table_name) {
    const table_map = {
      sys_db_object: this.sysDbObject,
      sys_dictionary: this.sysDictionary,
    };

    let Model = table_map[table_name];
    if (!Model) {
      // Dynamically define the model if it doesn't exist in the table_map
      const { data } = await this.getColumns(table_name);
      Model = this.sequelize.define(table_name, data);
    }

    return Model;
  }
}

module.exports = Sequelizer;
