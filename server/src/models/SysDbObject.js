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
module.exports = (sequelize, parent, sysDictionary) => {
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

    // Overload the `create` method
    static async create(data, options) {
      console.log("sysDBObject - data : %o", data);

      let record = {};

      // Create record if table name not nil
      if (!utils.nil(data.name)) {
        // Call the default `create` method using `super.create`
        record = await super.create(data, options);
        this.createTableIfNotExists(data);
        sysDictionary.createCollection(data);
      }

      return new Promise((resolve, reject) => {
        if (!utils.nil(record)) {
          resolve(record);
        } else {
          reject(
            "SysDbObject - Could not create table. Missing name attribute"
          );
        }
      });
    }

    /**
     * @param {Model} SysDbObjectModel Model of the table to create
     */
    static async createTableIfNotExists(SysDbObjectModel) {
      // TODO : Parent should come form super_class

      const { name, super_class } = SysDbObjectModel;
      const p = utils.nil(parent) ? SysDbObjectModel : parent;

      const queryInterface = sequelize.getQueryInterface();
      try {
        // Check if the table exists
        await queryInterface.describeTable(name);
        console.log("tablename %s already exists !", name);
        return {
          status: "success",
          message: `Table "${name}" already exists !`,
        };
      } catch (e) {
        await queryInterface.createTable(name, p.getAttributes());
        return { status: "success", message: `New table "${name}" created !` };
      }
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

    // static async insertRow(data) {
    //   data.sys_name = data.element;
    //   // unique 32-character sys_id. If already provided do not generate another
    //   data.sys_id = data.sys_id || utils.generateSysID();

    //   // set default values for sys_ columns
    //   data.sys_updated_by = data.sys_created_by = "system";
    //   data.sys_updated_on = data.sys_created_on = sequelize.fn("NOW");

    //   // Insert the new row
    //   return await this.create(data)
    //     .then((result) => {
    //       return {
    //         sys_id: result.dataValues.sys_id,
    //         status: "success",
    //         err: "",
    //       };
    //     })
    //     .catch((e) => {
    //       console.error("SysDictionary - inserRow - Insert row error : ", e);
    //       return { sys_id: "", status: "fail", err: e };
    //     });
    // }

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
        console.log("\n\n[SysDbObject] BEFORE CREATE HOOK \n\n");
      },
      afterCreate: (SysDbObjectModel, options) => {
        // TODO : create a new row in sys_dictionary for every new table creation
        console.log("\n\n[SysDbObject] AFTER CREATE HOOK \n\n");
        // SysDbObject.createTableIfNotExists(SysDbObjectModel);
        // parent.insertRow(SysDbObjectModel.dataValues); // create arecord in sys_metadata
        // Insert the new row into sys_dictionary
        // sysDictionary.createCollection(SysDbObjectModel.dataValues);
      },
      beforeUpdate: (SysDbObjectModel, options) => {
        // Do something before updating a sysMetadata instance
        console.log("\n\n[SysDbObject] BEFORE UPDATE HOOK \n\n");
      },
      afterUpdate: (SysDbObjectModel, options) => {
        // Do something after updating a sysMetadata instance
        console.log("\n\n[SysDbObject] AFTER UPDATE HOOK \n\n");
      },
      beforeBulkDestroy: (SysDbObjectModel) => {
        // Do something before destroying a sysMetadata instance
        console.log("\n\n[SysDbObject] BEFORE DESTROY HOOK \n\n");
        SysDbObject.getRows(SysDbObjectModel);
      },
      afterBulkDestroy: () => {
        // Do something after destroying a sysMetadata instance
        console.log("\n\n[SysDbObject] AFTER DESTROY HOOK \n\n");
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
