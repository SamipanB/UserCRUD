class ApiError extends Error {
  constructor(
    log,
    message = "An error occured",
    statusCode = 400,
    methodName = "Anonymous",
    endpoint
  ) {
    super(message);
    this.log = log;
    this.message = message;
    this.statusCode = statusCode;
    this.methodName = methodName;
    this.endpoint = endpoint;

    Error.captureStackTrace(this);
  }
}

module.exports = ApiError;
