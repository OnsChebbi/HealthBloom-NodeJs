const User = require("../models/User");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const Added = require("../models/AddedPatients");
const Patient = require("../models/Patient");

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

exports.getPatients = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  const patients = await User.find();
  const result = patients.filter((r) => doctor.Patients.includes(r._id));

  res.status(200).json(result);
};

exports.addPatient = async (req, res) => {
  const patient = await User.findById(req.body.patientId); //we add the user
  const doctor = await Doctor.findById(req.body.doctorId).populate("Patients");
  if (!patient) res.status(400).json({ message: "patient not found" });
  if (!doctor) res.status(400).json({ message: "doctor not found" });

  const array = [];
  doctor.Patients.map((item) => array.push(item._id.toString()));

  if (array.includes(req.body.patientId.toString())) {
    res.status(201).json({ message: "patient already exists" });
  } else {
    doctor.Patients.push(patient);
    await doctor.save();
    const added = new Added({ _doctorId: doctor._id, _patientId: patient._id });
    await added.save();
    res.status(200).json(doctor);
  }
};
exports.getAll = async (req, res) => {
  const userList = await (
      await User.find().populate("_doctor").exec()
  ).filter((user) => user.Role === "Doctor" && user._doctor);
  res.status(200).json(userList);
};

exports.setMapPos = async (req, res) => {
  //assign request body
  const { longitude, latitude } = req.body;
  if (!longitude || !latitude)
    res.status(400).json({ message: "please enter all fields" });
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) res.status(400).json({ message: "doctor not found" });
  doctor.officeMap.longitude = longitude;
  doctor.officeMap.latitude = latitude;
  await doctor.save();
  res.status(200).json(doctor);
};