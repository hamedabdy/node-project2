const { Sequelize, DataTypes } = require("sequelize");
const { v1: uuidv1, v5: uuidv5 } = require("uuid");

const { dbConfig } = require("../config/database");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: "localhost",
    dialect: "mariadb",
    define: {
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
      // timestamps: false, // Don't add the timestamp attributes (updatedAt, createdAt)
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
      // sys_created_on: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      // },
      sys_created_by: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      // sys_updated_on: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      // },
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
        console.log("Table has been dropped.");
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
    return this.sequelize
      .queryInterface()
      .removeColumn(tableName, columnName)
      .then(() => {
        console.log("Column deleted");
        ret = {
          table: tableName,
          column: columnName,
          status: "success",
          err: "",
        };
        return ret;
      })
      .catch((e) => {
        console.error(e);
        ret = { table: tableName, column: columnName, status: "fail", err: e };
        return ret;
      });
  }

  /*
   * RECORD operations
   */
  async handleRecord(req) {
    const { sys_id } = req.query;

    // if sys_id=-1 then create new record
    if (sys_id === "-1") {
      this.insertRow(req);
    } else {
      // Try to update an existing record
      this.updateRow(req);
    }
  }

  async getRows(req) {
    const { table_name } = req.params;
    const { sys_id, sysparm_query, sysparm_count } = req.query;
    const attributes = await this.getColumns(table_name);

    // Define the model for the table
    const Model = this.sequelize.define(table_name, attributes.data);

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

  async insertRow(req) {
    const { table_name } = req.params;
    const attributes = await this.getColumns(table_name);

    // unique 32-character sys_id
    req.body.sys_id = this.generateSysID();

    // set default values for sys_ columns
    req.body.sys_updated_by = req.body.sys_created_by = "system";
    req.body.sys_updated_on = req.body.sys_created_on =
      this.sequelize.fn("NOW");

    // Define the model for the table
    const Model = this.sequelize.define(table_name, attributes.data);

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
    let ret = { sys_id: "", status: "", err: "" };
    const { table_name, sys_id } = req.params;
    const attributes = await this.getColumns(table_name);

    const Model = this.sequelize.define(table_name, attributes.data);

    const instance = await Model.findOne({ where: { sys_id } });
    // No record found with the provided sys_id
    if (!instance) return [];

    req.body.sys_updated_on = this.sequelize.fn("NOW");

    return await Model.update(req.body, {
      where: {
        sys_id: sys_id,
      },
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

    // Define the model for the table
    const Model = this.sequelize.define(table_name, {});

    return await Model.destroy({ where: { sys_id } })
      .then((result) => {
        console.log("Record deleted : ", result.dataValues);
        return { sys_id: result, status: "success", err: "" };
      })
      .catch((e) => {
        console.error("Delete row error : ", e);
        return { sys_id: "", status: "fail", err: e };
      });
  }

  // async upsertRow(req) {
  //   let ret = { sys_id: "", status: "", err: "" };
  //   const { table_name } = req.params;
  //   const { sys_id } = req.body;
  //   const attributes = await this.getColumns(table_name);

  //   const Model = this.sequelize.define(table_name, attributes.data);

  //   let fields = Object.keys(attributes.data).filter(
  //     (item) =>
  //       ![
  //         "sys_id",
  //         "sys_created_on",
  //         "sys_created_by",
  //         "sys_updated_on",
  //         "sys_updated_by",
  //         "sys_class_name",
  //       ].includes(item)
  //   );

  //   // unique 32-character sys_id
  //   req.body.sys_id = sys_id == -1 ? this.generateSysID() : req.body.sys_id;
  //   req.body.sys_updated_on = req.body.sys_created_on = this.sequelize.fn('NOW');
  //   // set default values for "sys_" columns
  //   req.body.sys_updated_by = req.body.sys_created_by = "system";

  //   return await Model.upsert(req.body, {
  //     fields: fields,
  //     where: {
  //       sys_id: sys_id,
  //     },
  //   })
  //     .then(([instance, created]) => {
  //       if (!created) {
  //         // If the operation was an update, set sys_updated_on to the current date and time
  //         instance.sys_updated_on = this.getDateTime();
  //         instance.sys_update_by = "system2";
  //         instance.save();
  //       }
  //       console.log(created ? "Created" : "Updated");
  //       console.log(instance.get());
  //       ret = { sys_id: instance.get().sys_id, status: "success", err: "" };
  //       return ret;
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       ret = { sys_id: "", status: "fail", err: e };
  //       return ret;
  //     });
  // }

  //// HELPER METHODS
  generateSysID() {
    // Generate a UUIDv1
    const uuidv1Output = uuidv1().replace(/-/g, "");
    // Use the output of UUIDv1 as the input for UUIDv5
    return uuidv5(uuidv1Output, uuidv5.DNS).replace(/-/g, "");
  }
}

module.exports = Sequelizer;
