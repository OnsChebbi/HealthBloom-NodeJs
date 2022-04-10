const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");

// @desc    Set appointment
// @route   POST /api/appointments
// @access  Private
const setAppoitment = asyncHandler(async (req, res) => {
  const { title, _doctor, _patient, startDate, endDate, rRule, exDate } =
    req.body;

  if (!title || !_doctor || !_patient || !startDate || !endDate) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Create appointment
  const appointment = await Appointment.create({
    title,
    _doctor,
    _patient,
    startDate,
    endDate,
    rRule,
    exDate,
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400);
    throw new Error("appointment not created");
  }
});

module.exports = {
  setAppoitment,
};
