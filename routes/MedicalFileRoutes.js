const MedicalFileController = require('../controllers/MedicalFileController');
const express = require('express');
const router = express.Router();

router.get('/',MedicalFileController.getAll);
router.post('/add',MedicalFileController.add);
router.get('/getById/:id',MedicalFileController.getById);

module.exports = router;