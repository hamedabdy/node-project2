// Import Sequelize and Model
const { DataTypes, Model } = require("sequelize");

// const SysMetaData = require("./SysMetaData");

const Utils = require("../utils/utils");
const { log } = require("util");
const utils = new Utils();

/**
 * @param {object} sequelize : DB connection
 * @param {object} parent : parent class model (ex: SysMetaData)
 */
module.exports = (sequelize, parent) => {
  // const sysMetadata = SysMetaData(sequelize);

  class SysDbObject extends Model {
    static table_name = "sys_db_object";
    static attr = {
      ...parent.attr,
      sys_class_name: {
        ...parent.attr.sys_class_name,
        defaultValue: this.table_name,
      },
      name: DataTypes.STRING(80),
      label: DataTypes.STRING(80),
      super_class: DataTypes.STRING(32),
    };

    deletedRecords = []; // get a list of deleted records

    /**
     * @param {Model} SysDbObjectModel Model of the table to create
     */
    static async createTableIfNotExists(SysDbObjectModel) {
      // TODO : use default parent Model (SysMetaData) if no parent provided.
      // TODO : Parent should come form super_class

      const tableName = SysDbObjectModel.name;
      const super_class = SysDbObjectModel.super_class;
      const p = utils.nil(parent) ? SysDbObjectModel : parent;

      const queryInterface = sequelize.getQueryInterface();
      // Check if the table exists
      queryInterface
        .describeTable(tableName)
        .then((table) => {
          if (table) {
            console.log(
              "SYS_DB_OBJECT - createTable - %s already exists",
              tableName
            );
          }
        })
        .catch((error) => {
          // console.error("SYS_DB_OBJECT - createTable - ERROR : %o", error)
          console.log(
            "SYS_DB_OBJECT - createTable - Creating table : %s",
            tableName
          );
          queryInterface.createTable(
            SysDbObjectModel.dataValues.name,
            p.getAttributes()
          );
        });
    }

    /**
     * @param {string} tableName name of the table to delete
     */
    static async dropTableIfExists(tableName) {
      const queryInterface = sequelize.getQueryInterface();
      queryInterface
        .describeTable(tableName)
        .then((table) => {
          if (table) {
            console.log(
              "SYS_DB_OBJECT - dropTable - Deleting table : %s",
              tableName
            );
            queryInterface.dropTable(tableName);
          } else {
            console.log(
              "SYS_DB_OBJECT - dropTable - %s does not exist",
              tableName
            );
          }
        })
        .catch((error) => console.error(error));
    }

    /**
     *
     * @param {object} options object containing the where attribute
     */
    static async getRows(options) {
      // Fetch records to be deleted and store relevant information
      await SysDbObject.findAll(options).then((records) => {
        this.deletedRecords = records;
      });
    }

    // TODO : Methods : delete, MultipleDelet, findByID and findOne
  }

  // Initialize the SysGlideObject class by calling the init method
  SysDbObject.init(SysDbObject.attr, {
    // Specify the sequelize instance and the table name
    sequelize,
    modelName: SysDbObject.table_name,
    tableName: SysDbObject.table_name,
    hooks: {
      beforeCreate: (SysDbObjectModel, options) => {
        // Do something before creating a new sysMetadata instance
        console.log("\n\n BEFORE CREATE HOOK \n\n");
      },
      afterCreate: (SysDbObjectModel, options) => {
        // TODO : create a new row in sys_dictionary for every new table creation
        // TODO : Create table for every new row created in this table
        console.log("\n\n AFTER CREATE HOOK \n\n");
        SysDbObject.createTableIfNotExists(SysDbObjectModel);
        parent.insertRow(SysDbObjectModel.dataValues);
      },
      beforeUpdate: (SysDbObjectModel, options) => {
        // Do something before updating a sysMetadata instance
        console.log("\n\n BEFORE UPDATE HOOK \n\n");
      },
      afterUpdate: (SysDbObjectModel, options) => {
        // Do something after updating a sysMetadata instance
        console.log("\n\n AFTER UPDATE HOOK \n\n");
      },
      beforeBulkDestroy: (SysDbObjectModel) => {
        // Do something before destroying a sysMetadata instance
        console.log("\n\n BEFORE DESTROY HOOK \n\n");

        SysDbObject.getRows(SysDbObjectModel);
      },
      afterBulkDestroy: () => {
        // Do something after destroying a sysMetadata instance
        console.log("\n\n AFTER DESTROY HOOK \n\n");
        // if no record do nothing
        if (SysDbObject.deletedRecords.length == 0) return;

        const deletedTable = SysDbObject.deletedRecords.pop();
        const deletedTableName = deletedTable.get("name");
        const deletedTableSysId = deletedTable.get("sys_id");

        parent.deleteRow(deletedTableSysId);
        SysDbObject.dropTableIfExists(deletedTableName);
      },
    },
  });

  return SysDbObject;
};
