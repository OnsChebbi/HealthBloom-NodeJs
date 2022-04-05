const Doctor = require("../../models/Doctor");
const User = require("../../models/User");

//@desc Get User data
//@route Get /api/users/login/me
//@access Public
exports.getDoctorDetails = async (req, res) => {
  const userInfo = await User.findById(req.params.id);
  console.log(userInfo._doctor);
  const doctorInfo = await Doctor.findById(userInfo._doctor);
  console.log(doctorInfo);
  res.status(200).json([userInfo, doctorInfo]);
};

//@desc Get User list data
//@route Get /api/users/login/me
//@access Public
exports.getDoctorList = async (req, res) => {
  const doctorList = await User.find({ Role: "Doctor" });
  res.status(200).json(doctorList);
};

//@desc Get Doctor details
//@route Get /
//@access Public
exports.getDetails = async (req, res) => {
  const details = await Doctor.findById(req.params.id);
  res.status(200).json(details);
};
