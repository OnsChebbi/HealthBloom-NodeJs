const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor/doctorController");
router
  .route("/:id")
  .get(doctorController.getDoctorDetails)
  .post(doctorController.completeProfile);
router.route("/").get(doctorController.getDoctorList);
router.get("/details/:id", doctorController.getDetails);

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
