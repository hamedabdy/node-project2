// Import Sequelize and Model
const { DataTypes, Model } = require("sequelize");

// IMPORT SysMetaData Model class
const Utils = require("../utils/utils");
const { log, inspect } = require("util");
const utils = new Utils();
// const SysGlideObject = require("./SysGlideObject");
// const SysMetaData = require("./SysMetaData");

module.exports = (sequelize, parent, sysGlideObject) => {
  //   const sysMetadata = SysMetaData(sequelize);
  // const sysGlideObject = SysGlideObject(sequelize, parent);

  class SysDictionary extends Model {
    static table_name = "sys_dictionary";
    static attr = {
      ...parent.attr,
      // sys_class_name: {
      //   ...parent.attr.sys_class_name,
      //   defaultValue: this.table_name,
      // },
      element: DataTypes.STRING(80),
      // sys_name: {
      //   ...parent.attr.sys_name,
      //   defaultValue: this.element,
      // },
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

    /**
     *
     * @param {Model} sysDictionary sys_dictionary Sequelize model object
     * @returns Object {status : "success | fail"}
     */
    static async _createColumn(sysDictionary) {
      const {
        name,
        element,
        max_length,
        internal_type,
        default_value,
        mandatory,
      } = sysDictionary;

      const type = sysGlideObject.dataTypes[internal_type](max_length);
      // Add a column to the table
      return sequelize
        .getQueryInterface()
        .addColumn(name, element, {
          type: type,
          defaultValue: utils.nil(default_value)
            ? false
            : utils.bool(default_value),
          allowNull: mandatory ? false : true, // if manadatory set to false !
        })
        .then(() => {
          console.log(
            "SysDictionary - createColumn - New column added : %s",
            element
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
     * @param {Model} sysDictionary sys_dictionary Sequelize model object
     * @returns Object {status : "success | fail"}
     */
    static async updateColumn(sysDictionary) {
      if (utils.nil(sysDictionary)) return;

      const instance = await SysDictionary.findByPk(sysDictionary.sys_id);
      if (!instance) return { status: "fail", err: "Record not found" };

      const { name, element, max_length, unique, default_value } =
        sysDictionary;
      const type =
        sysGlideObject.dataTypes[sysDictionary.internal_type](max_length);

      return sequelize
        .getQueryInterface()
        .changeColumn(name, element, {
          type: type,
          unique: unique,
          defaultValue: utils.nil(default_value)
            ? false
            : utils.bool(default_value),
        })
        .then(() => {
          console.log(
            "SysDictionary - updateColumn - New column added : %s",
            element
          );
          return { status: "success" };
        })
        .catch((error) => {
          console.log(
            "SysDictionary - updateColumn - An error occurred: ",
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
      return await this.findByPk(sysID)
        .then((result) => {
          var r = !result ? [] : result;
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
      if (utils.bool(options.no_count)) {
        return await this.findAll(options)
          .then((records) => {
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
          return records;
        })
        .catch((e) => {
          console.error("SysDictionary - getRows - Error : ", e);
          return e;
        });
    }

    // TODO : Methods : delete row, MultipleDelete rows

    static async getAttribs(tableName, no_count) {
      // utils.warn("SysDictionary - getAttribs for table : %s", tableName);
      // TODO add condition on type == collection
      return await this.getRows({
        where: { name: tableName },
        no_count: utils.bool(no_count),
      }).then((records) => {
        return {
          rows: records.rows.map((r) => r.dataValues),
          count: records.count,
        };
      });
    }

    // overload the `create` method
    static async create(data, options) {
      console.log("sys_dictionary - create - data : %o", data);

      data.sys_name = data.element;
      data.sys_class_name = this.table_name;

      // Insert the new row in table
      const record = await super.create(data, options);

      // ignore if type is collection
      if (data.internal_type != "collection") this._createColumn(data);

      parent.create(data, options); // Create a new record in sys_metadata

      return new Promise((resolve, reject) => {
        if (!utils.nil(record)) resolve(record);
        else
          reject({
            sys_id: "",
            status: "fail",
            err: "SysDictionary - Create - Insert row error",
          });
      });
    }

    // overload the `destroy` method
    static async destroy(data, options) {
      console.log("sys_dictionary - destroy - data : %o", data);

      const record = await super
        .destroy({ where: { sys_id: data.where.sys_id } }, options)
        .then((result) => {
          console.log("SysDictionary - Records deleted : %s", result);
          return { sys_id: data.where.sys_id, status: "success" };
        })
        .catch((e) => {
          console.log("SysDictionary - error : %s", e);
          return { sys_id: "", status: "fail", err: e };
        });
    }

    async updateRow(data) {
      log(warning("sysDictionary - inside update row :  %o"), data);
      const instance = await this.findByPk(data.sys_id);
      if (!instance)
        return { sys_id: "", status: "fail", err: "Record not found" };

      data.sys_updated_on = this.sequelize.fn("NOW");
      // TODO : convert string to datetime
      delete req.body.sys_created_on; // TEMP solution

      return await instance
        .update(data, {
          where: {
            sys_id: data.sys_id,
          },
          individualHooks: true,
        })
        .then(() => {
          return { sys_id: data.sys_id, status: "success", err: "" };
        })
        .catch((e) => {
          console.error("[sysDictionary]Update row error : ", e);
          return { sys_id: sys_id, status: "fail", err: e };
        });
    }

    static async createCollection(data, options) {
      // unique 32-character sys_id
      // To prevent duplicate sys_id need a new sys_id for the collection record for each table creation.
      data.sys_id = utils.generateSysID();
      data.internal_type = "collection";
      data.sys_update_name = `${this.table_name}_${data.name}`;
      data.sys_name = data.name;

      this.create(data, options);

      // Copy all fields from the super_class table to the new collection table
      this._copyParentFields(data.name,data.super_class);
    }

    static async deleteCollection(data, options) {
      data.internal_type = "collection";
      try {
        // Get the collection record and all table fields
        await super.findOne({
            where: { name: data.where.name, internal_type: data.internal_type },
          })
          .then(async (collection) => {
            data.where = collection.dataValues;
            if (utils.nil(collection)) {
              console.log("sysDictionary - deleteCollection - No collection found");
              return;
            }
             // Delete all related records (fields) with the same name as the collection
            await super.destroy({ where: { name: data.where.name } }, options);
            // Delete the collection record itself
            return this.destroy(data, options);
          });
      } catch (e) {
        console.error("sysDictionary - deleteCollection - error : %s", e);
      }
    }

    /**
     * Copy all fields from a super_class table to a new table in sys_dictionary.
     * @param {string} tableName - The name of the new table.
     * @param {string} superClassName - The name of the super_class table.
     * @returns {Promise<Array>} - Array of created records.
     */
    static async _copyParentFields(tableName, superClassName) {
      // Find all fields for the super_class table
      const parentFields = await this.findAll({ where: { name: superClassName } });
      if (!parentFields || parentFields.length === 0) return [];

      // Attributes to exclude from copying
      const exclude = [
        "sys_update_name",
        "sys_updated_by",
        "sys_updated_on",
        "sys_created_on",
        "sys_created_by",
        "sys_mod_count",
        "sys_id",
      ];

      // Copy each field, changing the name to the new table
      const created = [];
      for (const field of parentFields) {
        const data = { ...field.dataValues };
        // Remove excluded attributes
        exclude.forEach((attr) => delete data[attr]);
        // Set the new table name
        data.name = tableName;
        // Generate a new sys_id for the new record
        data.sys_id = utils.generateSysID();
        // Set audit fields for the new record
        data.sys_created_on = data.sys_updated_on = this.sequelize.fn("NOW");
        data.sys_created_by = data.sys_updated_by = "system";
        data.sys_mod_count = 0; // Reset modification count
        data.update_name = `${this.table_name}_${data.name}_${data.element}`;
        const record = await this.create(data);
        created.push(record);
      }
      return created;
    }
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
        console.log(
          "\n\n[%s] BEFORE CREATE HOOK \n\n",
          SysDictionary.table_name
        );
      },
      afterCreate: (SysDictionaryModel, options) => {
        // Do something after creating a new SysDictionary instance
        console.log(
          "\n\n[%s] AFTER CREATE HOOK \n\n",
          SysDictionary.table_name
        );
        // Create an application file (sys_metadata)
      },
      beforeUpdate: (SysDictionaryModel, options) => {
        // Do something before updating a SysDictionary instance
        console.log(
          "\n\n[%s] BEFORE UPDATE HOOK \n\n",
          SysDictionary.table_name
        );
      },
      afterUpdate: (SysDictionaryModel, options) => {
        // Do something after updating a SysDictionary instance
        console.log(
          "\n\n[%s] AFTER UPDATE HOOK \n\n",
          SysDictionary.table_name
        );
        // TODO : Update column length or type
      },
      beforeBulkDestroy: (SysDictionaryModel) => {
        // Do something before destroying a SysDictionary instance
        console.log(
          "\n\n[%s] BEFORE BULK DESTROY HOOK \n\n",
          SysDictionary.table_name
        );
      },
      afterBulkDestroy: (options) => {
        // Do something after destroying a SysDictionary instance
        console.log(
          "\n\n[%s] AFTER BULK DESTROY HOOK \n\n",
          SysDictionary.table_name
        );
      },
    },
  });

  return SysDictionary;
};
