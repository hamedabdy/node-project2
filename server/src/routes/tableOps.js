const express = require("express");
const router = express.Router();

// CHALK LOGGING
const chalk = require("chalk");
const log = console.log;
const warning = chalk.bold.hex("#FFA500"); // Orange color

const Sequelizer = require("../services/Sequelizer");
const sequelizer = new Sequelizer();

const utils = require("../utils/utils"); // Load utilies

/*
 * SEQUELIZE ROUTES
 */
// test connection
router.get("/test_connection", async (req, res) => {
  const result = sequelizer.testConnection();
  res.json({ response: result });
});

// SHOW TABLES
router.get("/tables", async (req, res) => {
  const result = await sequelizer.getTables();
  res.json(result);
});

// CREATE a TABLE ==> TO BE CHANGED TO POST
router.get("/create_table", async (req, res) => {
  const { name } = req.query;
  const result = await sequelizer.createTable(name);
  res.json(result);
});

// DROP a TABLE ==> TO BE CHANGED TO DELETE
router.get("/drop_table", async (req, res) => {
  const { name } = req.query;
  const result = await sequelizer.dropTable(name);
  res.json(result);
});

// GET COLUMNS
router.get("/columns/:table_name", async (req, res) => {
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
    console.error("HandleRecord error: ", error);
    res.status(500).json({ error: "HandleRecord : Internal Server Error" });
  }
});

// DELETE ROW
router.delete("/rows/:table_name", async (req, res) => {
  try {
    const result = await sequelizer.deleteRow(req);
    res.json(result);
  } catch (error) {
    console.error("DELETE ROW : error: ", error);
    res.status(500).json({ error: "DELETE ROW : Internal Server Error" });
  }
});

module.exports = router;
