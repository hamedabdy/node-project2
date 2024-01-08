const express = require("express");
const router = express.Router();

const TableService = require("../services/TableService");
const databaseMiddleware = require("../middleware/databaseMiddleware");

const Sequelizer = require("../services/Sequelizer");
const sequelizer = new Sequelizer();

// Database connection middleware
router.use(databaseMiddleware);

/*
 * SEQUELIZE ROUTES
 */
// test connection
router.get("/test_connection", async (req, res) => {
  const result = sequelizer.testConnection();
  res.json({ response: result });
});

router.get("/show_columns", async (req, res) => {
  const { table } = req.query;
  const result = await sequelizer.getColumns(table);
  res.json(result);
});

router.get("/show_tables", async (req, res) => {
  const result = await sequelizer.getTables();
  res.json(result);
});

// Endpoint to create a table
router.get("/create_table", async (req, res) => {
  const { name } = req.query;
  const result = await sequelizer.createTable(name);
  res.json(result);
});

// Endpoint to drop a table
router.get("/drop_table", async (req, res) => {
  const { name } = req.query;
  const result = await sequelizer.dropTable(name);
  res.json(result);
});

// Endpoint to create a column
router.get("/create_column", async (req, res) => {
  const { table, column, length } = req.query;
  const result = await sequelizer.createColumn(table, column, length);
  res.json(result);
});

// Endpoint to delete a column
router.get("/delete_column", async (req, res) => {
  const { table, column } = req.query;
  const result = await sequelizer.removeColumnColumn(table, column);
  res.json(result);
});

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

router.delete("/rows/:table_name", async (req, res) => {
  try {
    const result = await sequelizer.deleteRow(req);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // UPSERT ROW
// router.post("/rows/:table_name", async (req, res) => {
//   try {
//     const result = await sequelizer.upsertRow(req);
//     res.json(result);
//   } catch (error) {
//     console.error("upsert rows error: ", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

/*
 * DB CONNECTION ROUTES (to decommission)
 */
// GET ROWS
// router.get("/rows/:table_name", async (req, res) => {
//   try {
//     const result = await TableService.getRows(req);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     // Release the connection back to the pool
//     req.db.release();
//   }
// });

// GET COLUMNS
router.get("/columns/:table_name", async (req, res) => {
  try {
    const result = await TableService.getColumns(req);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Release the connection back to the pool
    req.db.release();
  }
});

// // INSERT ROW
// router.post("/rows/:table_name", async (req, res) => {
//   try {
//     const result = await TableService.insertRow(req);
//     res.json(result);
//   } catch (error) {
//     console.error("Insert rows error: ", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     // Release the connection back to the pool
//     req.db.release();
//   }
// });

// DELETE ROW
router.delete("/rows/:table_name", async (req, res) => {
  try {
    await TableService.deleteRow(req, res);
  } catch (error) {
    console.error("Delete rows error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Release the connection back to the pool
    req.db.release();
  }
});

// Endpoint to get a list of tables
router.get("/tables", async (req, res) => {
  try {
    const result = await req.db.query("SHOW FULL TABLES;");
    const tables = result.map((row) => ({
      table_name: row["Tables_in_node-project"],
      table_type: row["Table_type"],
    }));
    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error fetching tables",
      message: err,
    });
  } finally {
    // Release the connection back to the pool
    req.db.release();
  }
});

module.exports = router;
