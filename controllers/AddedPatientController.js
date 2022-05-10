const Added = require("../models/AddedPatients");
exports.getAdded = async (req, res) => {
  const added = await Added.find({ _doctorId: req.params.id });
  res.status(200).json(added);
};
