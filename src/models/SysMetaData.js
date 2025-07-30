// Import Sequelize and Model
const { Model, DataTypes } = require("sequelize");

const Utils = require("../utils/utils"); // Load utilies
const utils = new Utils();

module.exports = (sequelize) => {
  class SysMetaData extends Model {
    static table_name = "sys_metadata";

    static attr = {
      sys_id: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      sys_created_by: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      sys_updated_by: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      sys_class_name: {
        type: DataTypes.STRING(80),
        allowNull: false,
        // defaultValue: this.table_name, // no default value for parent table
      },
      sys_name: { type: DataTypes.STRING(255) },
      sys_mod_count: {
        type: DataTypes.STRING(6),
        allowNull: false,
        // defaultValue: "0",
      },
      sys_scope: DataTypes.STRING(32),
      sys_update_name: DataTypes.STRING(255),
      sys_policy: DataTypes.STRING(40),
      sys_package: DataTypes.STRING(32),
    };

    static async findBySysId(sysID) {
      return await SysMetaData.findOne({ where: { sys_id: sysID } })
        .then((result) => {
          var r = result;
          if (!result) r = [];
          return { data: r, status: "success", err: "" };
        })
        .catch((e) => {
          console.error("SysMetaData - findBySysId - Error : ", e);
          return { data: "", status: "fail", err: e };
        });
    }

    static async updateRow(data) {
      const instance = await SysMetaData.findOne({
        where: { sys_id: data.sys_id },
      });
      // No record found with the provided sys_id
      if (!instance) return [];

      data.sys_updated_on = sequelize.fn("NOW");
      // TODO : convert string to datetime
      delete data.sys_created_on; // TEMP solution

      return await SysMetaData.update(data, {
        where: {
          sys_id: data.sys_id,
        },
        individualHooks: true,
      })
        .then(() => {
          return { sys_id: sys_id, status: "success", err: "" };
        })
        .catch((e) => {
          console.error("Update row error : ", e);
          return { sys_id: sys_id, status: "fail", err: e };
        });
    }

    /*
     * @parm: sysID, unoque Id the record to delete
     */
    static async deleteRow(data, options) {
      const { sys_id } = data.where;
      console.log("SysMetaData - deleteRow - data : %o", data);

      try {
        if (utils.nil(sys_id)) throw new Error("Missing or unknown sys_id");

        return await SysMetaData.destroy({
          where: { sys_id: sys_id },
          // returning: true,
        })
          .then((result) => {
            console.log("SYSMETADA - Records deleted : %i", result);
            return { sys_id: sys_id, status: "success" };
          })
          .catch((e) => {
            console.error("SysMetaData.destroy error : ", e);
            return { sys_id: "", status: "fail", err: e };
          });
      } catch (e) {
        console.error("SysMetaData - deleteRow - Error : ", e);
        return { sys_id: "", status: "fail", err: e };
      }
    }
  }

  // Initialize the SysMetaData class by calling the init method
  SysMetaData.init(SysMetaData.attr, {
    // Specify the sequelize instance and the table name
    sequelize, // DB connection info
    modelName: SysMetaData.table_name, // Model object name
    tableName: SysMetaData.table_name, // table name in DB
    // Define the hooks
    hooks: {
      beforeCreate: (SysMetaData, options) => {
        // Do something before creating a new SysMetaData instance
      },
      afterCreate: (SysMetaData, options) => {
        // Do something after creating a new SysMetaData instance
      },
      beforeUpdate: (SysMetaData, options) => {
        // Do something before updating a SysMetaData instance
      },
      afterUpdate: (SysMetaData, options) => {
        // Do something after updating a SysMetaData instance
      },
      beforeBulkDestroy: (SysMetaData, options) => {
        // Do something before destroying a SysMetaData instance
      },
      afterBulkDestroy: (SysMetaData, options) => {
        // Do something after destroying a SysMetaData instance
      },
    },
  });

  return SysMetaData;
};
