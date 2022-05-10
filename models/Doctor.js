var util = require("util");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var doctor = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  Speciality: String,
  OfficeAddress: String,
  ProfessionalCardNumber: Number,
  Insurance: String,
  LaborTime: String,
  Description: String,
  Started: Date,
  Patients: [{ type: Schema.Types.ObjectId, ref: "user" }],
  Status: {
    type: String,
    enum: ["Confirmed", "Pending"],
    default: "Pending",
  },
  Appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
  officeMap: {
    longitude: String,
    latitude: String,
  },
});

module.exports = mongoose.model("doctor", doctor);
