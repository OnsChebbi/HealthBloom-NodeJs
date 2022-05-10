const express = require("express");
const router = express.Router();
const { getAdded } = require("../controllers/AddedPatientController");

router.route("/:id").get(getAdded);

module.exports = router;