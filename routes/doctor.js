const express = require("express");
const router = express.Router();
const {
  doctorJoinRequest,
  getPatients,
  addPatient,
  getAll,
  setMapPos,
} = require("../controllers/DoctorController");
router.put("/join/:id", doctorJoinRequest);
router.get("/getDoctorPatients/:id", getPatients);
router.post("/addPatient", addPatient);
router.get("/getAll", getAll);
router.post("/setMapPos/:id", setMapPos);
module.exports = router;
