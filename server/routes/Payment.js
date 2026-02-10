const express = require('express');
const router = express.Router();
const { auth, isStudent } = require('../middleware/auth');
const { CapturePayment, VerifySignature, VerifyPayment, GetPaymentHistory } = require('../controllers/Payment');

router.post('/createorder', auth, isStudent, CapturePayment);
router.post('/verifySignature', VerifySignature);
router.post('/verifyPayment', auth, isStudent, VerifyPayment);
router.get('/getPaymentHistory', auth, isStudent, GetPaymentHistory);



module.exports = router;
