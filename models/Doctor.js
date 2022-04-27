var util = require("util");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var doctor = new Schema({
  Speciality: String,
  OfficeAddress: String,
  ProfessionalCardNumber: Number,
  Insurance: String,
  LaborTime: String,
  Description: String,
  //ActsAndCare : String,
  Started: Date,
  Patients: [{ type: Schema.Types.ObjectId, ref: "patient" }],
  Status: {
    type: String,
    enum: ["Confirmed", "Pending"],
    default: "Pending",
  },
  Appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
});

module.exports = mongoose.model("doctor", doctor);
