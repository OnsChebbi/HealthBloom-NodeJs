const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    speciality: {
      type: String,
      required: [true, "Please add a speciality"],
    },
    officeAddress: {
      type: String,
      required: [true, "Please add your office address"],
    },
    ProfessionalCardNumber: {
      type: Number,
      required: [true, "Please add your professional card number"],
      unique: true,
    },
    insurance: {
      type: String,
      required: [true, "Please add an Insurance"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("doctor", doctorSchema);
