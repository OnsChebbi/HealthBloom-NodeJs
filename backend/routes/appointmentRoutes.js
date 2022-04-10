const express = require("express");
const router = express.Router();
const { setAppoitment } = require("../controllers/appointmentController");

router.post("/", setAppoitment);

module.exports = router;
