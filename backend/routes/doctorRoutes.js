const express = require("express");
const router = express.Router();
const { createDoctor } = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

router.route("/newDoctor/:id").put(protect, createDoctor);

module.exports = router;
