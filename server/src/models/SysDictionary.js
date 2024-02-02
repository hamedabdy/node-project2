// Import Sequelize and Model
const { DataTypes, Model } = require("sequelize");

// IMPORT SysMetaData Model class
// const SysMetaData = require("./SysMetaData");

module.exports = (sequelize, parent) => {
  //   const sysMetadata = SysMetaData(sequelize);

  class SysDictionary extends Model {
    static table_name = "sys_dictionary";
    static attr = {
      ...parent.attr,
      sys_class_name: {
        ...parent.attr.sys_class_name,
        defaultValue: this.table_name,
      },
      column_name: DataTypes.STRING(80),
      column_label: DataTypes.STRING(80),
      internal_type: DataTypes.STRING(32),
      table: DataTypes.STRING(80),
      reference: DataTypes.STRING(32),
      default_value: DataTypes.STRING(80),
    };
  }

  // Initialize the SysGlideObject class by calling the init method
  SysDictionary.init(SysDictionary.attr, {
    // Specify the sequelize instance and the table name
    sequelize,
    modelName: SysDictionary.table_name,
    tableName: SysDictionary.table_name,
    hooks: {
      beforeCreate: (SysDictionary, options) => {
        // Do something before creating a new sysMetadata instance
      },
      afterCreate: (SysDictionary, options) => {
        // Do something after creating a new sysMetadata instance
      },
      beforeUpdate: (SysDictionary, options) => {
        // Do something before updating a sysMetadata instance
      },
      afterUpdate: (SysDictionary, options) => {
        // Do something after updating a sysMetadata instance
      },
      beforeDestroy: (SysDictionary, options) => {
        // Do something before destroying a sysMetadata instance
      },
      afterDestroy: (SysDictionary, options) => {
        // Do something after destroying a sysMetadata instance
      },
    },
  });

  return SysDictionary;
};
