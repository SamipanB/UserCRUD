const APIErrors = require("../utils/classes/api-errors");
const logger = require("../utils/logger/logger");

const errorHandler = (err, req, res, next) => {
  if (err instanceof APIErrors) {
    logger.log({
      level: "error",
      message: err.log,
      methodName: err.methodName,
      stack: err.stack,
    });
    res.status(err.statusCode).json({ status: false, error: err.message });
  } else {
    logger.log({ level: "error", message: err.message, stack: err.stack });
    res.status(500).json({ status: false, error: "Something went wrong" });
  }
};

module.exports = errorHandler;
