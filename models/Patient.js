var util = require("util");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
});

module.exports = mongoose.model("patient", patient);
