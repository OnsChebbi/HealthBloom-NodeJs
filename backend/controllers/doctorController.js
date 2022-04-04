const asyncHandler = require("express-async-handler");
const doctorModel = require("../models/doctorModel");
const User = require("../models/userModel");

// @desc    Register new doctor
// @route   PUT /api/doctors
// @access  Public
const createDoctor = asyncHandler(async (req, res) => {
  const {
    speciality,
    officeAddress,
    ProfessionalCardNumber,
    insurance,
    description,
  } = req.body;
  if (
    !speciality ||
    !officeAddress ||
    !ProfessionalCardNumber ||
    !insurance ||
    !description
  ) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findById(req.params.id);

  if (!userExists) {
    res.status(400);
    throw new Error("User doesnt exist");
  }
  if (userExists.id !== req.params.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const doc = new doctorModel({
    speciality,
    officeAddress,
    ProfessionalCardNumber,
    insurance,
    description,
  });
  userExists.role = "Doctor";
  userExists._doctor = doc;
  await userExists.save();

  res.status(200).json(userExists);
});

module.exports = {
  createDoctor,
};
