const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    /*adress: {
      type: String,
      required: [true, "Please add an adress"],
    },
    picture: {
      type: String,
      required: [true, "Please add a picture"],
    },
    Phone: {
      type: Number,
      required: [true, "Please add a phone number"],
    },
    birthDate: {
      type: Date,
      required: [true, "Please add your birth date"],
    },*/
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Assistant", "Admin"],
      default: "Patient",
    },
    _patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
    },
    _doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
    _assistant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assistant",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
