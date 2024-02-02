// Import Sequelize and Model
const { DataTypes, Model } = require("sequelize");

// IMPORT SysMetaData Model class
// const SysMetaData = require("./SysMetaData");

module.exports = (sequelize, parent) => {
  //   const sysMetadata = SysMetaData(sequelize);

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

    static async createTableIfNotExists(tableName, superClass) {
      const queryInterface = sequelize.getQueryInterface();

      // Check if the table exists
      const tableExists = await queryInterface.showAllTables();
      if (!tableExists.includes(tableName)) {
        // Create the table if it doesn't exist
        await queryInterface.createTable(tableName, SysDbObject.attr);
      }
    }

    static async dropTableIfExists(tableName) {
      const queryInterface = sequelize.getQueryInterface();

      // Check if the table exists
      const tableExists = await queryInterface.showAllTables();
      if (tableExists.includes(tableName)) {
        // Drop the table if it exists
        await queryInterface.dropTable(tableName);
      }
    }
  }

  // Initialize the SysGlideObject class by calling the init method
  SysDbObject.init(SysDbObject.attr, {
    // Specify the sequelize instance and the table name
    sequelize,
    modelName: SysDbObject.table_name,
    tableName: SysDbObject.table_name,
    hooks: {
      beforeCreate: (SysDbObject, options) => {
        // Do something before creating a new sysMetadata instance
      },
      afterCreate: (SysDbObject, options) => {
        // Do something after creating a new sysMetadata instance
      },
      beforeUpdate: (SysDbObject, options) => {
        // Do something before updating a sysMetadata instance
      },
      afterUpdate: (SysDbObject, options) => {
        // Do something after updating a sysMetadata instance
      },
      beforeDestroy: (SysDbObject, options) => {
        // Do something before destroying a sysMetadata instance
      },
      afterDestroy: (SysDbObject, options) => {
        // Do something after destroying a sysMetadata instance
      },
    },
  });

  return SysDbObject;
};
