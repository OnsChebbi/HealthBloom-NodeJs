const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    _doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
    _patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
    },
    startDate: {
      type: Date,
      required: [true, "Please add the starting date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please add the ending date"],
    },
    rRule: String,
    exDate: String,
    allDay: Boolean,
    roomId: Number,
    members: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
