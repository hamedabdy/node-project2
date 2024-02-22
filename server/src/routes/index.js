const express = require("express");
const router = express.Router();

// Import route modules
const tableOps = require("./tableOps");
// const userRoutes = require('./userRoutes');
// const productRoutes = require('./productRoutes');

// Use route modules
router.use("/table", tableOps);
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);

router.get("/events", (req, res) => {
  // Set the headers required for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send data periodically
  setInterval(() => {
    const data = `data: ${new Date().toLocaleTimeString()}\n\n`;
    res.write(data);
  }, 1000);
});

module.exports = router;
