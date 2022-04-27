const Patient = require("../models/Patient");
const User = require("../models/User");
const userController = require("../controllers/UserController");

// async function getOne(req, res, next) {
//     var id = req.params.id;
//     var patient = await Patient.findById({_id: id}, (err, data) => {
//         if (err) throw err;
//         return data;
//         //res.status(200).json(data);
//     })
// }

exports.getPatient = async (req, res) => {
  var id = req.params.id;
  var patient = await Patient.findById({ _id: id }, (err, data) => {
    if (err) throw err;
    res.status(200).json(data);
  });
};

exports.updatePatientAction = async (req, res) => {
  var id = req.params.id;

  var patient = {
    height: req.body.height,
  };
  Patient.findByIdAndUpdate({ _id: id }, patient, (err) => {
    if (err) throw err;
  });
  res.status(200).send(patient);
};

exports.deletePatient = async (req, res) => {
  var id = req.params.id;
  await Patient.findByIdAndRemove({ _id: id }, (err) => {
    if (err) throw err;
  });
  await userController.getPatients(function (err, data) {
    if (err) throw err;
    for (var i = 0; i < data.length; i++) {
      console.log(i);
      console.log(data[i]._patient);
      if (data[i]._patient.equals(id)) {
        console.log("hnee");
        id = data[i]._id;
      }
    }
  });
  console.log(id);
  await User.findByIdAndRemove({ _id: id }, (err) => {
    if (err) throw err;
  });
  res.status(200).send("delete successful");
};

exports.getPatientInfo = async (req, res) => {
  //check for params
  if (!req.params.id) {
    res.status(400);
    throw new Error("no params provided");
  }

  const patient = await Patient.findById(req.params.id)
    .populate("_userId")
    .exec();
  res.status(200).json(patient);
};
