const User = require('../models/User');

const Course = require('../models/Course');

const Tag = require('../models/Catagory');
const imageUploder = require('../utils/imageUploader');
const Catagory = require('../models/Catagory');
const { populate } = require('../models/Section');



const CreateCourse = async (req, resp) => {
    try {
        const { name, description, whatYouWillLearn, catagory, tag, price } = req.body;

        if (!name || !description || !whatYouWillLearn || !catagory || !price) {
            return resp.status(422).json({
                message: "All fields are required for creating the course!",
                success: false,
            })
        }

        const thumbnail = req.files.thumbnailImage;

        const validcatagory = await Catagory.findById(catagory);
        if (!validcatagory) {
            return resp.status(404).json({
                message: 'catagory does not exist please enter a valid Catagory',
                success: false,
            });
        }

        const instructorDetails = await User.findById(req.user.id);
        if (!instructorDetails) {
            return resp.status(404).json({
                message: 'Instructor details not found',
                success: false,
            });
        }
        const thumbnailImage = await imageUploder(thumbnail.tempFilePath, process.env.COURSE_THUMBNAIL_FOLDER_NAME);
        const newCourse = await Course.create({
            courseName: name,
            courseDescription: description,
            instructor: req.user.id,
            whatYouWillLearn: whatYouWillLearn,
            catagory: validcatagory._id,
            tag: tag,
            thumbnail: thumbnailImage.secure_url,
            price: price,
        });
        console.log("new course created :- ", newCourse);
        await User.findByIdAndUpdate(instructorDetails._id, {
            $push: {
                courses: newCourse._id,
            }
        }, { new: true });
        validcatagory.courses.push(newCourse._id);
        await validcatagory.save();

        return resp.status(200).json({
            message: 'New Course created successfully',
            success: true,
            data: newCourse,
        })
    } catch (error) {
        return resp.status(500).json({
            message: 'Error creating course',
            success: false,
            error: error.message,
        })
    }
}

const getAllCourses = async (req, resp) => {
    try {
        const allCourses = await Course.find({})
            .populate({
                path: 'instructor',
            })
            .populate({
                path: 'catagory',
            })
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })
            .exec();
        return resp.status(200).json({
            message: 'All courses fetched successfully',
            success: true,
            data: allCourses,
        })
    } catch (error) {
        return resp.status(500).json({
            message: 'Error fetching all courses',
            success: false,
            error: error.message,
        })
    }
}

const GetOneCourseAllDetails = async (req, resp) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return resp.status(403).json({
                message: 'No course exist with this course id',
                success: false,
            })
        }

        // const allCourseDetails = await course.populate({
        //     path: 'instructor',
        //     populate : {
        //         path:'additionalDetails'
        //     }
        // }).populate("catagory").populate("ratingAndReviews").populate({
        //     path:'courseContent',
        //     populate:{
        //         path:'subSection',
        //     }
        // }).exec();

        const allCourseDetails = await Course.findById(courseId).populate("instructor").populate("catagory").populate("ratingAndReviews").populate({
            path: 'courseContent',
            populate: {
                path: 'subSection'
            }
        });

        if (!allCourseDetails) {
            return resp.status(403).json({
                message: "course id is not able to finnd the course details something might be wrong int the course id",
                success: false,
            })
        }

        return resp.status(200).json({
            message: 'Course details fetched successfully',
            success: true,
            data: allCourseDetails,
        })
    } catch (error) {
        return resp.status(500).json({
            message: 'Error fetching course details',
            success: false,
            error: error.message,
        })
    }
}


const EditCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body

        if (!courseId) {
            return res.status(400).json({ error: "courseId is missing or undefined" })
        }

        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        // If Thumbnail Image is found, update it
        if (req.files && req.files.thumbnailImage) {
            console.log("thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await imageUploder(
                thumbnail.tempFilePath,
                process.env.COURSE_THUMBNAIL_FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        // Update only the fields that are present in the request body
        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "courseId" || key === "instructor") continue;
                if (key === "tag" || key === "instructions") {
                    try {
                        course[key] = JSON.parse(updates[key])
                    } catch (err) {
                        console.log("Error parsing JSON for key", key, err)
                        // If parse fails, try using raw value or ignore
                        course[key] = updates[key]
                    }
                } else {
                    course[key] = updates[key]
                }
            }
        }

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("catagory")
            // .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

module.exports = { CreateCourse, getAllCourses, GetOneCourseAllDetails, EditCourse };