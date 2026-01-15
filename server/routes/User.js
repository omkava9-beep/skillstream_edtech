const express = require('express');

const router = express.Router();

const {sendOtp , SignUp , Login , ChangePassword} = require("../controllers/Auth");
const {auth} = require("../middleware/auth");
const {
  ResetPasswordToken,
  ResetPassword,
} = require("../controllers/ResetPassword");



router.post('/signup' , SignUp);
router.post('/login' , Login);
router.post('/sendotp' , sendOtp);
router.post('/changepassword' , auth ,ChangePassword);


router.post('/reset-password-token' , ResetPasswordToken);
router.post('/reset-password/:token', ResetPassword);

module.exports = router; 

