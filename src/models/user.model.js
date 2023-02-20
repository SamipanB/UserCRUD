const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "User",
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
