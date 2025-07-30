const createError = require("http-errors");

const notFoundHandler = (req, res, next) => {
  next(createError(404, "Not Found : " + req.path));
};

const errorHandler = (err, req, res, next) => {
  // Log the error or perform other error-handling actions
  console.error(err.stack);

  // Send a generic error response
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
};

module.exports = { notFoundHandler, errorHandler };
