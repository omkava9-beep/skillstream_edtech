//course 
//catagory 
//sections//
//subsections
//rating 

const express = require('express');
const router = express.Router();
const { isInstructor, auth, isStudent, isAdmin } = require('../middleware/auth');
const { CreateCourse, getAllCourses, GetOneCourseAllDetails } = require('../controllers/CourseController');
const { CreateSection, DeleteSection ,UpdateSection } = require('../controllers/SectionController');
const { CreateSubSection, DeleteSubSection , UpdateSubSection } = require('../controllers/SubSectionController');
const { CreateCatagory,  getCatgoryPageDetails , ShowAllCatagory } = require('../controllers/Catagory');


router.post('/createcourse' , auth , isInstructor , CreateCourse );
router.post('/createsection' , auth , isInstructor , CreateSection);
router.post('/createsubsection' , auth , isInstructor , CreateSubSection );


router.put('/updatesection/:sectionId' , auth , isInstructor , UpdateSection);
router.put('/updatesubsection/:subSectionId' , auth , isInstructor , UpdateSubSection);
 


router.delete('/deletesection' , auth , isInstructor , DeleteSection);
router.delete('/deletesubsection' , auth , isInstructor , DeleteSubSection);

router.post('/getcatgorypagedetails/:catagoryId' , getCatgoryPageDetails );
router.get('/showallcatagories' , ShowAllCatagory );


router.get('/getallcourses' ,getAllCourses  );
router.get('/getcourse/:courseId' , GetOneCourseAllDetails  );

router.post('/enrollcourse/:courseId' , auth , isStudent , );
router.post('/createcatagory' , auth , isAdmin , CreateCatagory );

module.exports = router;
