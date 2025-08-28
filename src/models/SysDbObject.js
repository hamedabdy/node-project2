// Import Sequelize and Model
const { DataTypes, Model } = require("sequelize");

const Utils = require("../utils/utils");
const utils = new Utils();

/**
 * @param {object} sequelize : DB connection
 * @param {object} parent : parent class model (ex: SysMetaData)
 */
module.exports = (sequelize, parent, sysDictionary) => {
  class SysDbObject extends Model {
    static table_name = "sys_db_object";
    static attr = {
      ...parent.attr,
      // sys_class_name: {
      //   ...parent.attr.sys_class_name,
      //   defaultValue: this.table_name,
      // },
      name: DataTypes.STRING(80),
      label: DataTypes.STRING(80),
      super_class: DataTypes.STRING(32),
    };

    // Helper method to format table name for display
    static formatDisplayName(name) {
      return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    // Overload the `create` method
    static async create(data, options) {
      data.sys_class_name = this.table_name;
      data.sys_name = this.formatDisplayName(data.name);
      let record = {};

      // Create record if table name not nil
      if (!utils.nil(data.name)) {
        // Call the default `create` method using `super.create`
        record = await super.create(data, options);
        await this.createTableIfNotExists(data);
        await parent.create(data, options);
        
        // If super_class is specified, copy fields from parent table first
        if (!utils.nil(data.super_class)) {
          await sysDictionary._copyParentFields(data.name, data.super_class);
        }
        
        await sysDictionary.createCollection(data, options);
      }

      return new Promise((resolve, reject) => {
        if (!utils.nil(record)) {
          console.log("SysDbObject - Record created : %o", record.dataValues);

          resolve(record);
        } else {
          reject(
            "SysDbObject - Could not create table. Missing name attribute"
          );
        }
      });
    }

    // Overload the `destroy` method
    static async destroy(data, options) {
      const { name } = data.where;

      // Delete record if table name not nil
      if (!utils.nil(name)) {
        try {
          // Get the record first to access its sys_id
          const record = await super.findOne({ where: { name } });
          if (!record) {
            console.log("SysDbObject - No record found with name:", name);
            return;
          }

          // Delete related records in sys_dictionary first (collection and its fields)
          await sysDictionary.deleteCollection(data, options);

          // Delete the corresponding record in sys_metadata with the same sys_id
          await parent.deleteRow({ where: { sys_id: record.sys_id } }, options);

          // Delete the record in sys_db_object
          await super.destroy(data, options);

          // Finally, drop the actual database table
          await this.dropTableIfExists(name);

          console.log("SysDbObject - Successfully deleted record and all related data for:", name);
        } catch (e) {
          console.error("SysDbObject - Cascade delete error:", e);
          throw e; // Rethrow the error to be handled by the caller
        }
      }

      return;
    }

    /**
     * @param {Model} SysDbObjectModel Model of the table to create
     */
    static async createTableIfNotExists(SysDbObjectModel) {
      const { name, super_class } = SysDbObjectModel;
      const model = utils.nil(parent) ? SysDbObjectModel : parent;

      const queryInterface = sequelize.getQueryInterface();
      try {
        // Check if the table exists
        await queryInterface.describeTable(name);
        utils.warn("tablename %s already exists !", name);
        return {
          status: "error",
          message: `Table "${name}" already exists !`,
        };
      } catch (e) {
        // TO DO : every table is getting the full set of sys_* fields created from sys_db_object model. Optiomize this.
        // mainly sys_id, sys_created_on, sys_created_by, sys_updated_on, sys_updated_by, sys_class_name are needed
        await queryInterface.createTable(name, model.getAttributes());
        return { status: "success", message: `New table "${name}" created !` };
      }
    }

    /**
     * @param {string} tableName name of the table to delete
     */
    static async dropTableIfExists(tableName) {
      utils.warn("SYS_DB_OBJECT - dropTable - Deleting table : %s", tableName);

      try {
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
      } catch (e) {
        console.error("SYS_DB_OBJECT - dropTable - Error : %s", e);
      }
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
        console.log("\n\n[SysDbObject] BEFORE CREATE HOOK \n\n");
      },
      afterCreate: (SysDbObjectModel, options) => {
        console.log("\n\n[SysDbObject] AFTER CREATE HOOK \n\n");
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
      },
      afterBulkDestroy: () => {
        // Do something after destroying a sysMetadata instance
        console.log("\n\n[SysDbObject] AFTER DESTROY HOOK \n\n");
      },
    },
  });

  return SysDbObject;
};
