// services/ApiService.js
import axios from "axios";

const tableApiUrl = "http://localhost:3001/api/table";

const ApiService = {
  getTables: async () => {
    try {
      const response = await axios.get(`${tableApiUrl}/tables`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tables:", error);
      throw error;
    }
  },

  /**
   * @param {String} tableName name of the table to get columns for
   */
  getColumns: async (tableName) => {
    const uri = `${tableApiUrl}/columns/${tableName}`;
    try {
      const response = await axios.get(uri);
      return response.data;
    } catch (error) {
      console.error("Error fetching columns:", error);
      throw error;
    }
  },

  /**
   * @param {Object} parms contains sys_id and tableName
   */
  getData: async (parms) => {
    let p = {};
    if (parms.sys_id) p.sys_id = parms.sys_id;
    const uri = `${tableApiUrl}/rows/${parms.tableName}`;
    try {
      const response = await axios.get(uri, { params: p });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  /**
   * @param {String} tableName technical name of the table
   * @param {Object} newData key:value to insert into table
   */
  addData: async (tableName, newData) => {
    const uri = `${tableApiUrl}/rows/${tableName}`;
    try {
      const response = await axios.post(uri, newData, {
        params: { sys_id: newData.sys_id },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding rows:", error);
      throw error;
    }
  },

  /**
   * @param {String} tableName technical name of the table
   * @param {String} sys_id sys_id of the document to delete
   */
  deleteData: async (tableName, sys_id) => {
    const uri = `${tableApiUrl}/rows/${tableName}`;
    let p = {};
    if (sys_id) p.sys_id = sys_id;
    try {
      const response = await axios.delete(uri, { params: p });
      return response.data;
    } catch (error) {
      console.error("Error delete data:", error);
      throw error;
    }
  },
};

export default ApiService;
