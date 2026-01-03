const User = require('../models/User');
const Tag = require('../models/Catagory');
const Catagory = require('../models/Catagory');
const Course = require('../models/Course');
const CreateCatagory = async(req ,resp) =>{


    try {
        const {name , description} = req.body;

        if(!name||!description){
            return resp.status(403).json({
                success:false,
                message: "All fields are required",
            })
        }

        const newTag = await Catagory.create({name:name , description:description});

        console.log(newTag);

        return resp.status(200).json({
            message: 'New catagory created Successfully',
            success: true,
        })

    } catch (error) {
        console.log('error ocuured while creating a Tag:- ',error);
        resp.status(500).json({
            message:'something went wrong while creating a Tag',
            success:false,

        })
        process.exit(1);        
    }
}
const ShowAllCatagory = async(req,resp) =>{
    try {
        const allCatagory = await Catagory.find({}).populate('courses').exec();
        return resp.status(200).json({
            data:allCatagory,
            success:true,
            message:"All catagories are fetched successfully",
        })


    } catch (error) {
        resp.status(500).json({
            message:`something went wrong while fetching the tags data:- ${error.message}`,
            success:false
        })
    }
}

const getCatgoryPageDetails = async(req, resp)  => {
    try{
        const {catagoryId} = req.body;
        const catagoryDetails = await Catagory.findById(catagoryId).populate('courses').exec();
        if(!catagoryDetails){
            return resp.status(404).json({
                success:false,
                message:"Catagory not found",

            });
        }
        if(catagoryDetails.courses.length === 0){
            return resp.status(200).json({
                success:true,
                message:"No courses found for this catagory",
                data: catagoryDetails,
            });
        }
        const selectedCourses = catagoryDetails.courses;
        const catagoriesExpectSelectedCatagory = await Catagory.find({_id: {$ne  : catagoryId}}).populate('courses');
        let differentCourses = [];
        for(const catagory of catagoriesExpectSelectedCatagory ){
            differentCourses.push(...catagory.courses);
        }
        // //get the top selling courses

        const courses = await Course.find().sort({studentsEnrolled : -1}).limit(10).exec();
        const topsellings = courses;

        return resp.status(200).json({
            topsellings : topsellings,
            selectedCourses : selectedCourses,
            expectSelected : catagoriesExpectSelectedCatagory,
            message:'data fetched successfully for details page of catagories',
            success:true,
        })


        
    }catch(e){  
        return resp.status(500).json({
            success:false, 
            message: "something went wrong"
        })
    }

}

module.exports = {CreateCatagory , getCatgoryPageDetails , ShowAllCatagory};
