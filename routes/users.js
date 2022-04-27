require("dotenv").config();
const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const patientController = require("../controllers/PatientController");
var User = require("../models/User");
var Patient = require("../models/Patient");
var Doctor = require("../models/Doctor");
var Assistant = require("../models/Assistant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/** uploade user profile image */
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./uploads/doctorProfileImages/");
//   },
//   filename: (req, file, callback) => {
//     callback(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });
/*******************************************/

router.get("/", authenticateToken, userController.getAll);
router.post("/addUser" /*, upload.single("Image"),*/, userController.addUser);
router.post("/login", userController.login);
router.get("/updatePatient/:id", patientController.updatePatientAction);
router.get("/updateUser/:id", userController.updateUser);
router.get("/deleteUser/:id", userController.deleteUser);
router.get("/getAllPatients", userController.getAllPatients);
router.get("/deletePatient/:id", patientController.deletePatient);
router.get("/searchUser", userController.allUsers);

router.get("/patient/:id", patientController.getPatientInfo);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
