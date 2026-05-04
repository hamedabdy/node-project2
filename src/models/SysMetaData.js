// Import Sequelize and Model
const { Model, DataTypes } = require("sequelize");

const BaseModel = require("./BaseModel")();
const Utils = require("../utils/utils"); // Load utilies
const utils = new Utils();

module.exports = (sequelize) => {
  class SysMetaData extends Model {
    static table_name = "sys_metadata";

    static attr = {
      ...BaseModel.attr,
      sys_class_name: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      sys_name: { type: DataTypes.STRING(255) },
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
          console.error("[SysMetaData::findBySysId] - Error : ", e);
          throw e; // Rethrow the error to be handled by the caller
        });
    }

    static async updateRow(data) {
      const instance = await SysMetaData.findOne({where: { sys_id: data.sys_id }});
      // No record found with the provided sys_id
      if (!instance) return [];

      data.sys_updated_on = sequelize.fn("NOW");
      delete data.sys_created_on;

      return await SysMetaData.update(data, {
        where: {sys_id: data.sys_id},
        individualHooks: true,
      })
        .then(() => {
          return { sys_id: sys_id, status: "success", err: "" };
        })
        .catch((e) => {
          console.error("[SysMetaData::updateRow] - Error : ", e);
          return { sys_id: sys_id, status: "fail", err: e };
        });
    }

    /* overload destroy method to delete a record by sys_id
     * @parm: sysID, unoque Id the record to delete
     */
    static async destroy(data, options) {
      console.debug("[SysMetaData::destroy] - sys_id : %s", data);
      throw new Error("bla bla ");
      
      const { sys_id } = data.where;

      try {
        if (utils.nil(sys_id)) throw new Error("Missing or unknown sys_id");

        return await super.destroy({where: { sys_id: sys_id }})
          .then((result) => {
            console.debug("[SysMetaData::destroy] - Records deleted : %i", result);
            return { sys_id: sys_id, status: "success" };
          });
      } catch (e) {
        console.error("[SysMetaData::destroy] - Error : ", e);
        throw e; // Rethrow the error to be handled by the caller
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
