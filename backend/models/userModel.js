const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
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
    picture: String,
    phone: Number,
    birthDate: Date,
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Assistant"],
      default: "Doctor",
    },
    _doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
