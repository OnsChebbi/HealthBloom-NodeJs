const User = require("../models/User");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const { discriminator } = require("../models/User");

exports.doctorJoinRequest = async (req, res) => {
  //check for params
  if (!req.params.id) {
    res.status(400);
    throw new Error("no params provided");
  }
  //check for user
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("user not found");
  }

  //check for user role
  if (user.Role != "Doctor") {
    //console.log(user.role);
    res.status(400);
    throw new Error("this user is not a doctor");
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
    res.status(400);
    throw new Error("please enter all fields");
  }
  const doctor = new Doctor({
    Speciality: Speciality,
    OfficeAddress: OfficeAddress,
    ProfessionalCardNumber: ProfessionalCardNumber,
    Insurance: Insurance,
    LaborTime: LaborTime,
    Description: Description,
  });
  await doctor.save();
  console.log("doctor : " + doctor);
  user._doctor = doctor._id;
  await user.save();
  console.log("user : " + user);

  res.status(200).json(doctor);
};

exports.getInfo = async (req, res) => {
  //check for params
  if (!req.params.id) {
    res.status(400);
    throw new Error("no params provided");
  }
  //check for user
  const user = await User.findById(req.params.id).populate("_doctor").exec();
  if (!user) {
    res.status(400);
    throw new Error("user not found");
  }

  if (user.Role !== "Doctor") {
    res.status(400);
    throw new Error("user not doctor");
  }

  const doctor = await Doctor.findById(user._doctor);

  user._doctor = doctor;

  res.status(200).json(user);
};

exports.getDoctorList = async (req, res) => {
  const userList = await (
    await User.find().populate("_doctor").exec()
  ).filter((user) => user.Role === "Doctor" && user._doctor);
  res.status(200).json(userList);
};

exports.changeStatus = async (req, res) => {
  //check for params
  if (!req.params.id) {
    res.status(400);
    throw new Error("no params provided");
  }

  const { Started, Status } = req.body;

  if (!Started || !Status) {
    res.status(400);
    throw new Error("please enter all values");
  }

  const doctor = await Doctor.findById(req.params.id);
  doctor.Status = Status;
  doctor.Started = Started;
  await doctor.save();
  res.status(200).json(doctor);
};

exports.addPatient = async (req, res) => {
  const { doctor_id, user_id } = req.body;

  if (!doctor_id || !user_id) {
    res.status(400);
    throw new Error("please enter all values");
  }
  const doctor = await Doctor.findById(doctor_id);
  if (!doctor) {
    res.status(400);
    throw new Error("doctor not found");
  }
  const user = await User.findById(user_id);
  if (!user) {
    res.status(400);
    throw new Error("patient not found");
  }
  if (!doctor.Patients.includes(user_id)) {
    doctor.Patients.push(user);
    await doctor.save();
    res.status(200).json(doctor);
  } else {
    res.status(300).json({ message: "patient already exists" });
  }
};
exports.editDoctorProfile = async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error("no params provided");
  }
  //check for user
  const user = await User.findById(req.params.id).populate("_doctor").exec();
  if (!user) {
    res.status(400);
    throw new Error("user not found");
  }

  const {
    FirstName,
    LastName,
    Email,
    Speciality,
    Phone,
    OfficeAddress,
    LaborTime,
    Description,
  } = req.body;

  if (
    !FirstName ||
    !LastName ||
    !Email ||
    !Speciality ||
    !Phone ||
    !OfficeAddress ||
    !LaborTime ||
    !Description
  ) {
    res.status(400);
    throw new Error("enter all fields");
  }
  user.FirstName = FirstName;
  user.LastName = LastName;
  user.Phone = Phone;
  user.Email = Email;
  user._doctor.Speciality = Speciality;
  user._doctor.OfficeAddress = OfficeAddress;
  user._doctor.LaborTime = LaborTime;
  user._doctor.Description = Description;
  await user.save();
  res.status(200).json(user);
};

exports.doctors = async (req, res) => {
  const doctors = await Doctor.find({});
  res.status(200).json(doctors);
};

exports.getPatients = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  const patients = await User.find({ Role: "Patient" });

  const result = patients.filter((r) => doctor.Patients.includes(r._id));

  res.status(200).json(result);
};
