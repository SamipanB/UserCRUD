const router = require("express").Router();
const userController = require("../controller/user.controller");
const authHandler = require("../middleware/auth.middleware");
const upload = require("../utils/multer.config");

router.get("/", authHandler, userController.fetchAllUsers);
router.post("/", authHandler, userController.createUser);
router.delete("/", authHandler, userController.deleteUser);
router.patch("/", authHandler, userController.updateUser);
router.post(
  "/bulk",
  authHandler,
  upload.single("file"),
  userController.handleBulkUser
);
router.post("/login", userController.loginUser);

module.exports = router;
