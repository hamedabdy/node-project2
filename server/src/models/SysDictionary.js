// Import Sequelize and Model
const { DataTypes, Model } = require("sequelize");

// IMPORT SysMetaData Model class
const Utils = require("../utils/utils");
const utils = new Utils();
const SysGlideObject = require("./SysGlideObject");
// const SysMetaData = require("./SysMetaData");

module.exports = (sequelize, parent) => {
  //   const sysMetadata = SysMetaData(sequelize);
  const sysGlideObject = SysGlideObject(sequelize, parent);

  class SysDictionary extends Model {
    static table_name = "sys_dictionary";
    static attr = {
      ...parent.attr,
      sys_class_name: {
        ...parent.attr.sys_class_name,
        defaultValue: this.table_name,
      },
      element: DataTypes.STRING(80),
      sys_name: {
        ...parent.attr.sys_name,
        defaultValue: this.element,
      },
      column_label: DataTypes.STRING(80),
      internal_type: DataTypes.STRING(32),
      name: DataTypes.STRING(80),
      reference: DataTypes.STRING(32),
      default_value: DataTypes.STRING(80),
      max_length: DataTypes.INTEGER(6),
      attrributes: DataTypes.STRING(1000),
      active: DataTypes.BOOLEAN,
      display: DataTypes.BOOLEAN,
      mandatory: DataTypes.BOOLEAN,
      unique: DataTypes.BOOLEAN,
    };

    static deletedRecords = [];

    /**
     *
     * @param {Model} SysDictionary sys_dictionary Sequelize model object
     * @returns Object {status : "success | fail"}
     */
    static async createColumn(sysDictionary) {
      const tableName = sysDictionary.get("name");
      const columnName = sysDictionary.get("element");
      const length = sysDictionary.get("max_length");
      const type = sysDictionary.get("internal_type");
      // Add a column to the table
      return sequelize
        .getQueryInterface()
        .addColumn(tableName, columnName, {
          type: DataTypes.STRING(length),
          allowNull: true,
        })
        .then(() => {
          console.log(
            "SysDictionary - createColumn - New column added : %s",
            columnName
          );
          return { status: "success" };
        })
        .catch((error) => {
          console.log(
            "SysDictionary - createColumn - An error occurred: ",
            error
          );
          return { status: "fail" };
        });
    }

    /**
     *
     * @param {string} tableName name of the table to remove column from
     * @param {string} columnName name of column to remove
     * @returns {object} {table, column, status: success | fail, err}
     */
    static async removeColumn(tableName, columnName) {
      return sequelize
        .getQueryInterface()
        .removeColumn(tableName, columnName)
        .then((result) => {
          console.log(
            "SysDictionary - removeColumn - Column deleted : ",
            result
          );
          return {
            table: tableName,
            column: columnName,
            status: "success",
            err: "",
          };
        })
        .catch((e) => {
          console.error(
            "SysDictionary - removeColumn - Remove Column error : ",
            e
          );
          return {
            table: tableName,
            column: columnName,
            status: "fail",
            err: e,
          };
        });
    }

    /**
     * find a record using its sys_id
     * @param {string} sysID unique id of the record to look for
     * @returns {object}
     */
    static async findBySysId(sysID) {
      return await this.findOne({ where: { sys_id: sysID } })
        .then((result) => {
          var r = result;
          if (!result) r = [];
          return { data: r, status: "success", err: "" };
        })
        .catch((e) => {
          console.error("SysDictionary - findBySysId - Error : ", e);
          return { data: "", status: "fail", err: e };
        });
    }

    /**
     * get all rows for given options
     * @param {object} options sequelize options or query
     * @returns {promises} array of object records or error
     */
    static async getRows(options) {
      const no_count = utils.nil(options.no_count) ? false : true;
      if (no_count) {
        return await this.findAll(options)
          .then((records) => {
            console.log("sys_dcitionary - getRows - options: %o", options);
            return {
              rows: records,
              count: records.length,
            };
          })
          .catch((e) => {
            console.error("SysDictionary - getRows - Error : ", e);
            return e;
          });
      }
      return await this.findAndCountAll(options)
        .then((records) => {
          console.log(
            "sys_dcitionary - getRows - options: %o\ncount : %i",
            options,
            records.count
          );
          return records;
        })
        .catch((e) => {
          console.error("SysDictionary - getRows - Error : ", e);
          return e;
        });
    }

    /**
     * setter for setDeletedRecords. Get a list of records before being deleted
     * @param {object} options object containing the where attribute
     */
    static async setDeletedRecords(options) {
      // Fetch records to be deleted and store relevant information
      await this.getRows(options).then((records) => {
        this.deletedRecords = records;
      });
    }

    // TODO : Methods : delete row, MultipleDelete rows

    static async getAttribs(tableName, no_count) {
      utils.warn("SysDictionary - getAttribs for table : %s", tableName);
      // TODO add condition on type == collection
      return await this.getRows({
        where: { name: tableName },
        no_count: no_count,
      }).then((records) => {
        return {
          rows: records.rows.map((r) => r.dataValues),
          count: records.count,
        };
      });
    }

    static async insertRow(data) {
      data.sys_name = data.element;
      // unique 32-character sys_id. If already provided do not generate another
      data.sys_id = data.sys_id || utils.generateSysID();

      // set default values for sys_ columns
      data.sys_updated_by = data.sys_created_by = "system";
      data.sys_updated_on = data.sys_created_on = sequelize.fn("NOW");

      // Insert the new row
      return await this.create(data)
        .then((result) => {
          return {
            sys_id: result.dataValues.sys_id,
            status: "success",
            err: "",
          };
        })
        .catch((e) => {
          console.error("SysDictionary - inserRow - Insert row error : ", e);
          return { sys_id: "", status: "fail", err: e };
        });
    }

    //// TODO : boolean values should not be string
    static async updateColumn(model) {
      if (utils.nil(model)) return;

      const instance = await SysDictionary.findOne({
        where: { sys_id: model.sys_id },
      });
      // No record found with the provided sys_id
      if (!instance) return [];

      const type = sysGlideObject.dataTypes[model.internal_type];

      const queryInterface = sequelize.getQueryInterface();
      queryInterface.changeColumn(model.name, model.element, {
        type: type(model.max_length),
        unique: model.unique,
        defaultValue: utils.nil(model.default_value)
          ? false
          : utils.bool(model.default_value),
      });
    }

    // /**
    //  * @param {string} sysID unique Id the record to delete
    //  */
    // static async deleteRow(sysID) {
    //   try {
    //     if (utils.nil(sysID)) throw new Error("Missing or unknown sys_id");

    //     var { data } = await this.findBySysId(sysID);

    //     if (utils.nil(data))
    //       throw new Error(
    //         "SysDictionary - deleteRow - sys_id not found in " + this.table_name
    //       );

    //     return await SysDictionary.destroy({
    //       where: { sys_id: data.sys_id },
    //       returning: true,
    //     })
    //       .then((result) => {
    //         console.log("SysDictionary - Record deleted : %i", result);
    //         return { sys_id: result, status: "success", err: "" };
    //       })
    //       .catch((e) => {
    //         console.error("SysDictionary.destroy error : ", e);
    //         return { sys_id: "", status: "fail", err: e };
    //       });
    //   } catch (e) {
    //     console.error("SysDictionary - deleteRow - Error : ", e);
    //     return { sys_id: "", status: "fail", err: e };
    //   }
    // }
  }

  // Initialize the SysGlideObject class by calling the init method
  SysDictionary.init(SysDictionary.attr, {
    // Specify the sequelize instance and the table name
    sequelize,
    modelName: SysDictionary.table_name,
    tableName: SysDictionary.table_name,
    hooks: {
      beforeCreate: (SysDictionaryModel, options) => {
        // Do something before creating a new SysDictionary instance
        console.log("\n\n BEFORE CREATE HOOK \n\n");
      },
      afterCreate: (SysDictionaryModel, options) => {
        // Do something after creating a new SysDictionary instance
        console.log("\n\n AFTER CREATE HOOK \n\n");
        SysDictionary.createColumn(SysDictionaryModel);
        // Create an application file
      },
      beforeUpdate: (SysDictionaryModel, options) => {
        // Do something before updating a SysDictionary instance
        console.log("\n\n BEFORE UPDATE HOOK \n\n");
      },
      afterUpdate: (SysDictionaryModel, options) => {
        // Do something after updating a SysDictionary instance
        console.log("\n\n AFTER UPDATE HOOK \n\n");
        // TODO : Update column length or type
        SysDictionary.updateColumn(SysDictionaryModel);
      },
      beforeBulkDestroy: (SysDictionaryModel) => {
        // Do something before destroying a SysDictionary instance
        console.log("\n\n BEFORE BULK DESTROY HOOK \n\n");
        SysDictionary.setDeletedRecords(SysDictionaryModel);
      },
      afterBulkDestroy: () => {
        // Do something after destroying a SysDictionary instance
        console.log("\n\n AFTER BULK DESTROY HOOK \n\n");
        // if no record do nothing
        if (SysDictionary.deletedRecords.length == 0) return;

        const deletedCoulumn = SysDictionary.deletedRecords.pop();
        const tableName = deletedCoulumn.get("name");
        const deletedColumnName = deletedCoulumn.get("element");
        // const deletedTableSysId = deletedCoulumn.get("sys_id");

        SysDictionary.removeColumn(tableName, deletedColumnName);
      },
    },
  });

  return SysDictionary;
};
