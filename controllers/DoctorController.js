const User = require("../models/User");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");

exports.doctorJoinRequest = async (req, res) => {
  //check for doctor id
  if (!req.params.id) {
    res.status(400).json({ error: "provide an doctor_id in params" });
  }
  //check for user
  const doctor_to_complete = await Doctor.findById(req.params.id)
    .populate("_userId")
    .exec();
  if (!doctor_to_complete) {
    res.status(400).json({ error: "doctor not found" });
  }
  //assign request body
  const {
    Speciality,
    OfficeAddress,
    ProfessionalCardNumber,
    Insurance,
    LaborTime,
    Description,
  } = req.body;
  //check for request body
  if (
    !Speciality ||
    !OfficeAddress ||
    !ProfessionalCardNumber ||
    !Insurance ||
    !LaborTime ||
    !Description
  ) {
    res.status(400).json({ error: "please enter all doctor fields" });
  }
  if (isNaN(ProfessionalCardNumber))
    res
      .status(400)
      .json({ error: "Professional Card Number must have a numeric value" });

  await doctor_to_complete.update({
    Speciality: Speciality,
    OfficeAddress: OfficeAddress,
    ProfessionalCardNumber: ProfessionalCardNumber,
    Insurance: Insurance,
    LaborTime: LaborTime,
    Description: Description,
  });
  const token = jwt.sign(
    {
      user_id: doctor_to_complete._userId,
      Email: doctor_to_complete._userId.Email,
      Role: doctor_to_complete._userId.Role,
      restUserInfo: doctor_to_complete._id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "2h",
    }
  );

  res.status(200).json(token);
};
