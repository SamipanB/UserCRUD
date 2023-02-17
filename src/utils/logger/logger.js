const winston = require("winston");
const { logFormat, consoleFormat } = require("./format");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.label({ label: "Log" }),
    winston.format.timestamp(),
    logFormat
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

module.exports = logger;
