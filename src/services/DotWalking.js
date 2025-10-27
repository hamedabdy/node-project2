const { Sequelize } = require("sequelize");
const Utils = require("../utils/utils");

class DotWalking {
  /**
   * Constructor for DotWalking class
   * @param {Sequelize} sequelizeCon - Instantiated Sequelize connection object
   * @param {string} tableName - Name of the current table
   * @param {string} parent - Name of the parent table
   */
  constructor(sequelizeCon, tableName, parent) {
    this.sequelize = sequelizeCon;
    this.tableName = tableName;
    this.parent = parent;
    this.isValid = validateConnection();
    this.parentModel = null;
    this.currentModel = null;
    this.utils = new Utils();
  }

  /**
   * Validates the Sequelize connection
   * @returns {Promise<boolean>} True if connection is valid, false otherwise
   */
  async validateConnection() {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      console.error('[DotWalking::validateConnection] Connection validation failed:', error);
      return false;
    }
  }

  /**
   * Checks if parent table is specified
   * @returns {boolean} True if parent exists, false otherwise
   */
  hasParent() {
    return Boolean(this.parent && this.parent.trim());
  }

  /**
   * Retrieves fields from the parent table
   * @param {Array<string>} attributes - Specific fields to retrieve (optional)
   * @returns {Promise<Object>} Retrieved parent fields or error object
   */
  async getParentFields(attributes = []) {
    try {
      // Validate prerequisites
      if (!this.isValid && !(await this.validateConnection())) {
        throw new Error('[DotWalking::getParentFields] Invalid database connection');
      }

      if (!this.hasParent()) {
        throw new Error('[DotWalking::getParentFields] No parent table specified');
      }

      // Get parent model dynamically
      this.parentModel = this.sequelize.model(this.parent);
      this.currentModel = this.sequelize.model(this.tableName);

      // Set up the query options
      const queryOptions = {
        include: [{
          model: this.parentModel,
          attributes: attributes.length > 0 ? attributes : undefined
        }]
      };

      // Fetch data with parent association
      const results = await this.currentModel.findAll(queryOptions);

      return {
        status: 'success',
        data: results
      };

    } catch (error) {
      console.error('[DotWalking::getParentFields] Error retrieving parent fields:', error);
      return {
        status: 'error',
        message: error.message,
        error
      };
    }
  }

  /**
   * Writes data to current table and parent table if it exists
   * @param {Object} data - Data to write with properties for both tables
   * @returns {Promise<Object>} Result of the write operation
   */
  async writeData(data) {
    try {
      // Validate prerequisites
      if (!this.isValid) {
        throw new Error('[DotWalking::writeData] Invalid database connection');
      }

      // Start a transaction
      const t = await this.sequelize.transaction();

      try {
        // Separate parent and current table data
        const parentData = {};
        const currentData = {};
        
        Object.entries(data).forEach(([key, value]) => {
          if (key.includes('.')) {
            const [table, field] = key.split('.');
            if (table === this.parent) {
              parentData[field] = value;
            }
          } else {
            currentData[key] = value;
          }
        });

        // If parent exists and parent data is provided, write to parent first
        let parentRecord = null;
        if (this.hasParent() && Object.keys(parentData).length > 0) {
          this.parentModel = this.sequelize.model(this.parent);
          parentRecord = await this.parentModel.create(parentData, { transaction: t });
          
          // Link the parent record
          if (parentRecord) {
            currentData.sys_id = currentData.sys_id || this.utils.generateSysID();
            currentData[`${this.parent}_sys_id`] = parentRecord.sys_id;
          }
        }

        // Write to current table
        this.currentModel = this.sequelize.model(this.tableName);
        const result = await this.currentModel.create(currentData, { transaction: t });

        // Commit transaction
        await t.commit();

        return {
          status: 'success',
          data: result,
          parentData: parentRecord
        };

      } catch (error) {
        // Rollback transaction on error
        await t.rollback();
        throw error;
      }

    } catch (error) {
      console.error('[DotWalking::writeData] Error writing data:', error);
      return {
        status: 'error',
        message: error.message,
        error
      };
    }
  }

  /**
   * Updates existing records in both current and parent tables
   * @param {string} sys_id - The sys_id of the record to update
   * @param {Object} data - Data to update with dot notation for parent fields
   * @returns {Promise<Object>} Result of the update operation
   */
  async updateRecord(sys_id, data) {
    try {
      // Validate prerequisites
      if (!this.isValid) {
        throw new Error('[DotWalking::updateRecord] Invalid database connection');
      }

      // Start a transaction
      const t = await this.sequelize.transaction();

      try {
        this.currentModel = this.sequelize.model(this.tableName);
        
        // Find the current record
        const currentRecord = await this.currentModel.findOne({
          where: { sys_id },
          transaction: t
        });

        if (!currentRecord) {
          throw new Error(`[DotWalking::updateRecord] Record with sys_id ${sys_id} not found in ${this.tableName}`);
        }

        // Separate parent and current table data
        const parentData = {};
        const currentData = {};
        
        Object.entries(data).forEach(([key, value]) => {
          if (key.includes('.')) {
            const [table, field] = key.split('.');
            if (table === this.parent) {
              parentData[field] = value;
            }
          } else {
            currentData[key] = value;
          }
        });

        // Update parent record if exists
        if (this.hasParent() && Object.keys(parentData).length > 0) {
          this.parentModel = this.sequelize.model(this.parent);
          const parentSysId = currentRecord[`${this.parent}_sys_id`];
          
          if (parentSysId) {
            await this.parentModel.update(parentData, {
              where: { sys_id: parentSysId },
              transaction: t
            });
          }
        }

        // Update current record
        currentData.sys_updated_on = new Date();
        await currentRecord.update(currentData, { transaction: t });

        // Commit transaction
        await t.commit();

        // Fetch the updated record with parent data
        const updatedRecord = await this.currentModel.findOne({
          where: { sys_id },
          include: this.hasParent() ? [{
            model: this.parentModel,
            required: false
          }] : []
        });

        return {
          status: 'success',
          data: updatedRecord
        };

      } catch (error) {
        // Rollback transaction on error
        await t.rollback();
        throw error;
      }

    } catch (error) {
      console.error('[DotWalking::updateRecord] Error updating record:', error);
      return {
        status: 'error',
        message: error.message,
        error
      };
    }
  }

}

module.exports = DotWalking;