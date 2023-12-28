const express = require("express");
const router = express.Router();

const TableService = require("../services/TableService");
const databaseMiddleware = require("../middleware/databaseMiddleware");

// Database connection middleware
router.use(databaseMiddleware);

// GET ROWS
router.get("/rows/:table_name", async (req, res) => {
  try {
    const result = await TableService.getRows(req);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Release the connection back to the pool
    req.db.release();
  }
});

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

// INSERT ROW
router.post("/rows/:table_name", async (req, res) => {
  try {
    const result = await TableService.insertRow(req);
    res.json(result);
  } catch (error) {
    console.error("Insert rows error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Release the connection back to the pool
    req.db.release();
  }
});

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

// // Endpoint to create a table
// router.post("/create-table", async (req, res) => {
//   const { tableName, columns } = req.body;

//   try {
//     // Create the table
//     await req.db.query(`CREATE TABLE ${tableName} (${columns})`);
//     res.json({ message: `Table '${tableName}' created successfully` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error creating table" });
//   } finally {
//     // Release the connection back to the pool
//     req.db.release();
//   }
// });

// // Endpoint to add a column to an existing table
// router.post("/add-column", async (req, res) => {
//   const { tableName, columnName, columnType } = req.body;

//   try {
//     // Add a column to the table
//     await req.db.query(
//       `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`
//     );
//     res.json({
//       message: `Column '${columnName}' added to table '${tableName}'`,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error adding column" });
//   } finally {
//     // Release the connection back to the pool
//     req.db.release();
//   }
// });

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
