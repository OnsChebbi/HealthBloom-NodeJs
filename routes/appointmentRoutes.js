const express = require("express");
const router = express.Router();
const {
    setAppoitment,
    getAppoitments,
    editAppointment,
    deleteAppointment,
} = require("../controllers/AppointmentController");

router.route("/").post(setAppoitment);
router
    .route("/:id")
    .get(getAppoitments)
    .put(editAppointment)
    .delete(deleteAppointment);

module.exports = router;