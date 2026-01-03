const express = require('express');

const router = express.Router();

const { auth, isStudent } = require('../middleware/auth');
const { 
  UpdateProfile, 
  DeleteAccount, 
  GetAllUsersDetails,
  GetEnrolledCourses ,
  uploadProfilePicture
} = require('../controllers/ProfileController');

router.put('/updateprofile', auth, UpdateProfile);
router.post('/uploadprofilepicture', auth, uploadProfilePicture);
router.delete('/deleteaccount', auth,isStudent, DeleteAccount);

router.get('/getallusers', auth, GetAllUsersDetails);

router.get('/getenrolledcourses', auth, GetEnrolledCourses);

module.exports = router;