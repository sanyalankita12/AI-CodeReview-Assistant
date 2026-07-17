const express = require('express');
const router = express.Router();
const { generateReview, getReviewsForProject } = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');

router.post('/:projectId', protect, generateReview);
router.get('/:projectId', protect, getReviewsForProject);

module.exports = router;