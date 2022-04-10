var util = require("util");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var doctor = new Schema(
  {
    Speciality: String,
    OfficeAddress: String,
    ProfessionalCardNumber: Number,
    Insurance: String,
    LaborTime: String,
    Description: String,
    ActsAndCare: String,
    Status: {
      type: String,
      enum: ["Pending", "Accepted"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("doctor", doctor);
