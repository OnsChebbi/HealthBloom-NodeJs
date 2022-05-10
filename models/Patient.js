const util = require("util");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var patient = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  Appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
  Cart: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
  height: Number,
  weight: Number,
  IMC: Number,
  BloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
    default: "unknown",
  },
  Notifications: [
    {
      description: String,
      State: {
        type: String,
        enum: ["seen", "notSeen"],
        default: "notSeen",
      },
    },
  ],
  medicalFile: {
    type: Schema.Types.ObjectId,
    ref: "MedicalFile",
  },
});

module.exports = mongoose.model("patient", patient);
