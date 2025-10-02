// Import Sequelize and Model
const { DataTypes, Model } = require("sequelize");

// IMPORT SysMetaData Model class
const _dataTypes = require("./dataTypes");

module.exports = (sequelize, parent) => {

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

    static customDataTypes = _dataTypes;

    static async findBySysId(sysID) {
      return await SysGlideObject.findOne({ where: { sys_id: sysID } })
        .then((result) => {
          var r = result;
          if (!result) r = [];
          return { data: r, status: "success", err: "" };
        })
        .catch((e) => {
          console.error("SysGlideObject - findBySysId - Error : ", e);
          return { data: "", status: "fail", err: e };
        });
    }

    /**
     * Retrieves the name attribute for a given sys_id from the sys_glide_object table.
     * @param {string} sysID - The sys_id of the record to look for.
     * @returns {Promise<string|null>} The name attribute if found, otherwise null.
     */
    static async getGlideObjectNameBySysId(sysID) {
      try {
        const result = await SysGlideObject.findOne({
          where: { sys_id: sysID },
          attributes: ['name'], // Only retrieve the 'name' attribute
        });
        return result ? result.name : null;
      } catch (e) {
        console.error("SysGlideObject - getGlideObjectNameBySysId - Error : ", e);
        return null;
      }
    }
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
