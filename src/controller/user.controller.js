const UserModel = require("../models/user.model");
const APIError = require("../utils/classes/api-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleBulkUser = require("../services/bulk-create.service");
const uploadFile = require("../utils/s3.config");
const { sendUrlToAdmin } = require("../services/send-mail.service");

class UserController {
  async createUser(req, res, next) {
    try {
      const exists = await UserModel.findOne({
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
      });
      if (exists)
        throw new APIError(
          "Duplication Error",
          "User already exists",
          400,
          "createUser"
        );
      const user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      res.json({
        status: true,
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }

  async fetchAllUsers(req, res, next) {
    try {
      const users = await UserModel.find();
      res.json({ status: true, data: users });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await UserModel.findById(req.query.id);
      const { email, phoneNumber, role, password, name } = req.body;

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.role = role;
      user.password = password;

      await user.save();

      res.json({ status: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await UserModel.findById(req.query.id);

      if (!user)
        throw new APIError(
          "user not found",
          "User doesn't exist",
          400,
          "deleteUser"
        );
      await user.remove();
      res.json({ status: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async loginUser(req, res, next) {
    const invalidCredError = new APIError(
      "invalid creds",
      "Invalid Credentials",
      400,
      "loginUser",
      "/users/login"
    );
    try {
      const user = await UserModel.findOne({ email: req.body.email })
        .select("password")
        .select("email")
        .select("role");
      console.log(user);
      if (!user) throw invalidCredError;
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) throw invalidCredError;
      const data = {
        userId: user._id,
        role: user.role,
        email: user.email,
      };
      const token = jwt.sign(data, process.env.SECRET_KEY);
      res.json({ status: true, data: token });
    } catch (err) {
      next(err);
    }
  }

  async handleBulkUser(req, res, next) {
    try {
      // await uploadFile("uploads", req.file);
      const result = await handleBulkUser(req.file.buffer);
      console.log(result);
      res.json({
        status: true,
        data: { message: "Uploaded successfully", url: result.Location },
      });
      sendUrlToAdmin(req.user.email, result.Location);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
