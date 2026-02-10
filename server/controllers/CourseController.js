const User = require('../models/User');
const Course = require('../models/Course');
const Catagory = require('../models/Catagory');
const Section = require("../models/Section");
const Subsection = require("../models/Subsection");
const imageUploder = require('../utils/imageUploader');



const CreateCourse = async (req, resp) => {
    try {
        console.log("CREATE_COURSE_REQUEST_BODY:", req.body);
        const { name, description, whatYouWillLearn, catagory, tag: _tag, price, status } = req.body;

        if (!name || !description || !whatYouWillLearn || !catagory || (price === undefined || price === null || price === "")) {
            console.log("MISSING_FIELDS:", { name, description, whatYouWillLearn, catagory, price });
            return resp.status(422).json({
                message: "All fields are required for creating the course!",
                success: false,
                missingFields: { name: !name, description: !description, whatYouWillLearn: !whatYouWillLearn, catagory: !catagory, price: (price === undefined || price === null || price === "") }
            })
        }

        const thumbnail = req.files ? req.files.thumbnailImage : null;
        if (!thumbnail) {
            return resp.status(422).json({
                message: "Thumbnail image is required",
                success: false,
            })
        }

        const validcatagory = await Catagory.findById(catagory);
        if (!validcatagory) {
            return resp.status(404).json({
                message: 'category does not exist please enter a valid Category',
                success: false,
            });
        }

        const instructorId = req.user.id || req.user._id;
        const instructorDetails = await User.findById(instructorId);
        if (!instructorDetails) {
            console.log("INSTRUCTOR_NOT_FOUND_FOR_ID:", instructorId);
            return resp.status(404).json({
                message: 'Instructor details not found',
                success: false,
            });
        }

        let tag = _tag;
        if (typeof _tag === 'string') {
            try {
                tag = JSON.parse(_tag);
            } catch (e) {
                tag = [_tag];
            }
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
            status: status || "Draft",
        });

        console.log("new course created :- ", newCourse);

        const instructorUpdate = await User.findByIdAndUpdate(instructorDetails._id, {
            $push: {
                courses: newCourse._id,
            }
        }, { new: true });

        validcatagory.courses.push(newCourse._id);
        await validcatagory.save();

        const populatedCourse = await Course.findById(newCourse._id)
            .populate("instructor")
            .populate("catagory")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        return resp.status(200).json({
            message: 'New Course created successfully',
            success: true,
            data: populatedCourse,
        })
    } catch (error) {
        console.error("COURSE_CREATE_ERROR:", error);
        return resp.status(500).json({
            message: 'Error creating course',
            success: false,
            error: error.message,
        })
    }
}

const getAllCourses = async (req, resp) => {
    try {
        // Only return published courses for public viewing
        const allCourses = await Course.find({ status: "Published" })
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
                message: "Course ID not found in the database. Something might be wrong with the ID.",
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

const DeleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    await Subsection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Remove course from Category
        await Catagory.findByIdAndUpdate(course.catagory, {
            $pull: { courses: courseId },
        });

        // Remove course from Instructor's courses array
        await User.findByIdAndUpdate(course.instructor, {
            $pull: { courses: courseId },
        });

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

module.exports = { CreateCourse, getAllCourses, GetOneCourseAllDetails, EditCourse, DeleteCourse };