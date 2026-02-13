const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getAverageRating, GetAllRatingAndReviewsOfACourse, CreateRatingAndReviews } = require('../controllers/RatingAndReviewsController');
const { isStudent } = require('../middleware/auth');





router.post('/createrating/:courseId', auth, isStudent, CreateRatingAndReviews);
router.get('/getallratings/:courseId', auth, GetAllRatingAndReviewsOfACourse);
router.get('/getaverageRating/:courseId', auth, getAverageRating);
router.get('/getallratings', auth, GetAllRatingAndReviewsOfACourse);
router.post('/createrating', auth, isStudent, CreateRatingAndReviews);


module.exports = router;
