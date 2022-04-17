const MedicalFileController = require('../controllers/MedicalFileController');
const express = require('express');
const router = express.Router();

router.get('/',MedicalFileController.getAll);
router.post('add',MedicalFileController.add);

module.exports = router;