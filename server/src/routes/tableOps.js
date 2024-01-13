const express = require("express");
const router = express.Router();

const Sequelizer = require("../services/Sequelizer");
const sequelizer = new Sequelizer();

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

// CREATE a COLUMN ==> TO BE CHANGED TO POST
router.get("/create_column", async (req, res) => {
  const { table, column, length } = req.query;
  const result = await sequelizer.createColumn(table, column, length);
  res.json(result);
});

// DELETE a COLUMN ==> TO BE CHANGED TO DELETE
router.get("/delete_column", async (req, res) => {
  const { table, column } = req.query;
  const result = await sequelizer.removeColumn(table, column);
  res.json(result);
});

// GET ROWS
router.get("/rows/:table_name", async (req, res) => {
  try {
    const result = await sequelizer.getRows(req);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// INSERT ROW
router.post("/rows/:table_name", async (req, res) => {
  try {
    const result = await sequelizer.insertRow(req);
    res.json(result);
  } catch (error) {
    console.error("Insert rows error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE ROW
router.delete("/rows/:table_name", async (req, res) => {
  try {
    const result = await sequelizer.deleteRow(req);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
