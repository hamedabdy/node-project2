const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const databaseMiddleware = require("../middleware/databaseMiddleware");

// Database connection middleware
router.use(databaseMiddleware);

class TableService {
  async getColumns(req) {
    const { table_name } = req.params;

    const result = await req.db.query(`DESCRIBE ${table_name}`);
    return result;
  }

  async getRows(req) {
    let ret = { result: "", status: "", err: "" };
    const { table_name } = req.params;
    const { sys_id, sysparm_query } = req.query;
    var query = `SELECT * FROM ${table_name} `;
    query += sys_id ? `WHERE sys_id="${sys_id}";` : ``;
    query += sysparm_query ? `WHERE sys_id='${sysparm_query}';` : ``;

    const result = await req.db.query(query);
    return result;
  }

  async insertRow(req) {
    let ret = { sys_id: "", status: "", err: "" };
    const { table_name } = req.params;

    // Generate a unique 32-character sys_id
    const sys_id = uuidv4().replace(/-/g, ""); // Remove dashes
    // Include sys_id in the columns and values
    req.body.sys_id = sys_id;

    const keys = Object.keys(req.body);
    const values = keys.map((k) => `"${req.body[k]}"`).join(", ");

    const query = `INSERT INTO ${table_name}(${keys.join(
      ", "
    )}) VALUES (${values}) RETURNING *`;

    const result = await req.db.query(query, []);
    ret = { sys_id: result[0].sys_id, status: "success", err: "" };
    return ret;
  }

  async deleteRow(req, res) {
    let ret = { sys_id: "", status: "", err: "", msg: "" };
    const { table_name } = req.params;
    const { sys_id, sysparm_query } = req.query;
    //DELETE FROM Persons WHERE sys_id = '4fa90c13bb294e47aa12c6dcff1ce659';
    // Use a parameterized query to avoid SQL injection
    const query = `DELETE FROM ${table_name} WHERE sys_id = ? RETURNING *;`;
    const values = [sys_id];

    const result = await req.db.query(query, values);
    // Check if any rows were deleted
    if (result.length > 0) {
      ret.msg = "Row deleted successfully";
      ret.status = "success";
      res.json(ret);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  }
}

module.exports = new TableService();
