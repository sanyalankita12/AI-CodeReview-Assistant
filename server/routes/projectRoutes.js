const express = require('express');
const router = express.Router();
const { submitCode, submitCodeFromFile, getMyProjects } = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', protect, submitCode);
router.post('/upload', protect, upload.single('codeFile'), submitCodeFromFile);
router.get('/', protect, getMyProjects);

module.exports = router;