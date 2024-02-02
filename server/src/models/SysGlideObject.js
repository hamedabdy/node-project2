// Import Sequelize and Model
const { DataTypes, Model } = require("sequelize");

// IMPORT SysMetaData Model class
// const SysMetaData = require("./SysMetaData");

module.exports = (sequelize, parent) => {
  // const sysMetadata = SysMetaData(sequelize);

  class SysGlideObject extends Model {
    static table_name = "sys_glide_object";
    static attr = {
      ...parent.attr,
      sys_class_name: {
        ...parent.attr.sys_class_name,
        defaultValue: this.table_name,
      },
      name: DataTypes.STRING(80),
      label: DataTypes.STRING(80),
    };
  }

  // Initialize the SysGlideObject class by calling the init method
  SysGlideObject.init(SysGlideObject.attr, {
    // Specify the sequelize instance and the table name
    sequelize,
    modelName: SysGlideObject.table_name,
    tableName: SysGlideObject.table_name,
    hooks: {
      beforeCreate: (SysGlideObject, options) => {
        // Do something before creating a new sysMetadata instance
      },
      afterCreate: (SysGlideObject, options) => {
        // Do something after creating a new sysMetadata instance
      },
      beforeUpdate: (SysGlideObject, options) => {
        // Do something before updating a sysMetadata instance
      },
      afterUpdate: (SysGlideObject, options) => {
        // Do something after updating a sysMetadata instance
      },
      beforeDestroy: (SysGlideObject, options) => {
        // Do something before destroying a sysMetadata instance
      },
      afterDestroy: (SysGlideObject, options) => {
        // Do something after destroying a sysMetadata instance
      },
    },
  });

  return SysGlideObject;
};
