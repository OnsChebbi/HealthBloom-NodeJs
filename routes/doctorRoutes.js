const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor/doctorController");
router.get("/:id", doctorController.getDoctorDetails);
router.get("/", doctorController.getDoctorList);
router.get("/details/:id", doctorController.getDetails);

module.exports = router;
