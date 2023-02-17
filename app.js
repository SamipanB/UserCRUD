const express = require("express");
require("dotenv").config({ path: `./env/${process.env.NODE_ENV}.env` });
require("./src/utils/db-connection");
const userRouter = require("./src/routes/user.route");
const errorHandler = require("./src/middleware/error.middleware");

const app = express();
app.use(express.json());

app.use("/api/users", userRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Listening on port");
});
