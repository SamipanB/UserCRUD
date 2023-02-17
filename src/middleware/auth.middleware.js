const jwt = require("jsonwebtoken");
const ApiError = require("../utils/classes/api-errors");

const authMap = {
  admin: [
    "GET /api/users",
    "POST /api/users",
    "PATCH /api/users",
    "DELETE /api/users",
    "POST /api/users/bulk",
  ],
  user: ["GET /api/users"],
};

const authError = new ApiError("forbidden", "User is not authorized", 403);

const authHandler = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization").split(" ")[1];
    const user = jwt.verify(authHeader, process.env.SECRET_KEY);
    req.user = user;
    if (
      authMap[user.role.toLowerCase()].includes(
        `${req.method} ${req.baseUrl.split("?")[0]}`
      )
    ) {
      next();
    } else {
      throw authError;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authHandler;
