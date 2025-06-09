const express = require("express");
const router = express.Router();

const Sequelizer = require("../services/Sequelizer");
const sequelizer = new Sequelizer();

const utils = require("../utils/utils"); // Load utilies

const dbBackup = require("../services/DbBackup");

/*
 * SEQUELIZE ROUTES
 */
// TEST DB CONNECTION
router.get("/test_connection", async (req, res) => {
  const result = await sequelizer.testConnection();
  res.json(result);
});

// SHOW TABLES
router.get("/tables", async (req, res) => {
  const result = await sequelizer.getTables();
  res.json(result);
});

// Get Table Info
router.get("/table_info/:table_name", async (req, res) => {
  const { table_name } = req.params;
  const result = await sequelizer.getTableInfo(table_name);
  res.json(result);
});

// CREATE a TABLE ==> DO NOT USE. Use Create Record in sys_db_object
router.get("/create_table", async (req, res) => {
  const { name } = req.query;
  const result = await sequelizer.createTable(name);
  res.json(result);
});

// DROP a TABLE ==> DO NOT USE. Use Delete Record in sys_db_object
router.get("/drop_table", async (req, res) => {
  const { name } = req.query;
  const result = await sequelizer.dropTable(name);
  res.json(result);
});

// GET FIELDS
router.get("/columns/:table_name", async (req, res) => {
  const { table_name } = req.params;
  try {
    const result = await sequelizer.getFields(table_name);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// AUX GET COLUMNS - Describe Table
router.get("/descTable/:table_name", async (req, res) => {
  const { table_name } = req.params;
  try {
    const result = await sequelizer.getColumns(table_name);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET ROWS
router.get("/rows/:table_name", async (req, res) => {
  try {
    const result = await sequelizer.getRows(req);
    res.json(result);
  } catch (error) {
    console.error("GET ROWS : error: ", error);
    res.status(500).json({ error: "GET ROWS : Internal Server Error" });
  }
});

// INSERT / UPDATE ROW
router.post("/rows/:table_name", async (req, res) => {
  try {
    const result = await sequelizer.handleRecord(req);
    res.json(result);
  } catch (error) {
    console.error("HandleRecord - error: ", error);
    res.status(500).json({ error: "HandleRecord : Internal Server Error" });
  }
});

// DELETE ROW
router.delete("/rows/:table_name", async (req, res) => {
  try {
    const result = await sequelizer.deleteRow(req);
    res.json(result);
  } catch (error) {
    console.error("DELETE ROW - error: ", error);
    res.status(500).json({ error: "DELETE ROW : Internal Server Error" });
  }
});

/*
 * DB BACKUP ROUTES
 */
router.get("/db-backup", async (req, res) => {
  try {
    // Allow ?appendDate=true to control filename
    const appendDate = req.query.appendDate === "true";
    console.log("DB BACKUP - appendDate: ", appendDate);
    await dbBackup(appendDate);
    res.json({ status: "success", message: "DB backup is triggerd" });
  } catch (e) {
    console.error("DB BACKUP - error: ", e);
    res.status(500).json({ error: "DB BACKUP : Internal Server Error", message: e.message });
  }
});

module.exports = router;
