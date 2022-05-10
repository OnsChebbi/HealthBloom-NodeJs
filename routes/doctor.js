const express = require("express");
const router = express.Router();
const { doctorJoinRequest } = require("../controllers/DoctorController");
router.put("/join/:id", doctorJoinRequest);

module.exports = router;
