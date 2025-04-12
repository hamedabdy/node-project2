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

    // Overload the `create` method
    static async create(data, options) {
      data.sys_class_name = this.table_name;
      data.sys_name = data.label;
      let record = {};

      // Create record if table name not nil
      if (!utils.nil(data.name)) {
        // Call the default `create` method using `super.create`
        record = await super.create(data, options);
        this.createTableIfNotExists(data);
        parent.create(data, options);
        sysDictionary.createCollection(data, options);
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
          // Call the default `destroy` method
          await super
            .destroy(data, options)
            .then((result) => {
              console.log("SysDbObject - Records deleted : %s", result);
            })
            .catch((e) => {
              console.log("SysDbObject - error : %s", e);
            });
          this.dropTableIfExists(name);
          parent.deleteRow(data, options);
          sysDictionary.deleteCollection(data, options);
        } catch (e) {
          console.log("SysDbObject - error : %s", e);
        }
      }

      return;
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
        utils.warn("tablename %s already exists !", name);
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
