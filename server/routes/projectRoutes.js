const express = require('express');
const router = express.Router();
const { submitCode, getMyProjects } = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, submitCode);
router.get('/', protect, getMyProjects);

module.exports = router;