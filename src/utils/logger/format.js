const winston = require("winston");
const { printf } = winston.format;

const logFormat = printf(
  ({ level, message, label, timestamp, methodName, stack }) => {
    return `${timestamp} [${label}] ${level}: ${message}, method: ${methodName}
    ${stack}`;
  }
);

const consoleFormat = printf(({ message, methodName, stack }) => {
  return `${message}, method: ${methodName}
    ${stack}`;
});

module.exports = { logFormat, consoleFormat };
