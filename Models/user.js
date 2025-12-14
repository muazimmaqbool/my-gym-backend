const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, //removes extra spaces from start & end : " hello " → "hello"
  },
  address: {
    type: "String",
    required: true,
  },
  gymName: {
    type: String,
    required: true,
  },
  gymAddress: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, //automatically converts email to lowercase
  },
  password: {
    type: String,
    required: true,
    select: false, // security
  },
  phone: { type: Number, required: true },
  role: { type: String, enum: ["owner", "staff"], required: true },
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
