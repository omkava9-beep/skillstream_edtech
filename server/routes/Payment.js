const express = require('express');
const router = express.Router();
const { auth, isStudent } = require('../middleware/auth');
const { CapturePayment, VerifySignature, VerifyPayment, CaptureMultipleCourses, VerifyMultipleCoursesPayment, GetPaymentHistory } = require('../controllers/Payment');

// Single course payment
router.post('/createorder', auth, isStudent, CapturePayment);
router.post('/verifyPayment', auth, isStudent, VerifyPayment);

// Multi-course payment (for cart)
router.post('/createmultiorder', auth, isStudent, CaptureMultipleCourses);
router.post('/verifymultipayment', auth, isStudent, VerifyMultipleCoursesPayment);

// Payment history
router.get('/getPaymentHistory', auth, isStudent, GetPaymentHistory);

// Webhook
router.post('/verifySignature', VerifySignature);



module.exports = router;
