const express = require("express");
const router = express.Router();
const {
  setAppoitment,
  getAppoitments,
} = require("../controllers/AppointmentController");

router.route("/").post(setAppoitment);
router.route("/:id").get(getAppoitments);
module.exports = router;
