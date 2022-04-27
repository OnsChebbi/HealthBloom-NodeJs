const express = require("express");
const router = express.Router();
const {
  doctorJoinRequest,
  getInfo,
  getDoctorList,
  changeStatus,
  addPatient,
  editDoctorProfile,
  getPatients,
} = require("../controllers/doctorController");

//router.get("/all/", doctors);
router.put("/join/:id", doctorJoinRequest);
router.get("/:id", getInfo);
router.get("/", getDoctorList);
router.put("/status/:id", changeStatus);
router.post("/", addPatient);
router.put("/:id", editDoctorProfile);
router.get("/getPatients/:id", getPatients);

module.exports = router;
