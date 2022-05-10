var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var addedPatient = new Schema(
  {
    _doctorId: {
      type: Schema.Types.ObjectId,
      ref: "doctor",
    },
    _patientId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("addedPatient", addedPatient);
