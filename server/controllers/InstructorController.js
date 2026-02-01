const User = require('../models/User');
const Course = require('../models/Course');

// Get instructor statistics
const getInstructorStats = async (req, resp) => {
    try {
        const instructorId = req.user.id;

        // Find all courses by this instructor
        const instructorCourses = await Course.find({ instructor: instructorId })
            .populate('studentsEnrolled', 'firstName lastName email');

        if (!instructorCourses || instructorCourses.length === 0) {
            return resp.status(200).json({
                success: true,
                message: 'No courses found for this instructor',
                data: {
                    totalStudents: 0,
                    totalCourses: 0,
                    totalRevenue: 0,
                    courses: []
                }
            });
        }

        // Calculate statistics
        let totalStudents = 0;
        let totalRevenue = 0;
        const courseStats = [];

        instructorCourses.forEach(course => {
            const studentsEnrolled = course.studentsEnrolled.length;
            const revenue = studentsEnrolled * course.price;

            totalStudents += studentsEnrolled;
            totalRevenue += revenue;

            courseStats.push({
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                price: course.price,
                studentsEnrolled: studentsEnrolled,
                revenue: revenue,
                status: course.status,
                createdAt: course.createdAt
            });
        });

        return resp.status(200).json({
            success: true,
            message: 'Instructor statistics fetched successfully',
            data: {
                totalStudents,
                totalCourses: instructorCourses.length,
                totalRevenue,
                courses: courseStats
            }
        });

    } catch (error) {
        console.error('Error in getInstructorStats:', error);
        return resp.status(500).json({
            success: false,
            message: 'Error fetching instructor statistics',
            error: error.message
        });
    }
};

// Get instructor courses with detailed information
const getInstructorCourses = async (req, resp) => {
    try {
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({ instructor: instructorId })
            .populate('catagory', 'name')
            .populate('studentsEnrolled', 'firstName lastName email')
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })
            .sort({ createdAt: -1 });

        if (!instructorCourses || instructorCourses.length === 0) {
            return resp.status(200).json({
                success: true,
                message: 'No courses found for this instructor',
                data: []
            });
        }

        // Add revenue calculation to each course
        const coursesWithRevenue = instructorCourses.map(course => {
            const studentsCount = course.studentsEnrolled.length;
            const revenue = studentsCount * course.price;

            return {
                ...course.toObject(),
                studentsCount,
                revenue
            };
        });

        return resp.status(200).json({
            success: true,
            message: 'Instructor courses fetched successfully',
            data: coursesWithRevenue
        });

    } catch (error) {
        console.error('Error in getInstructorCourses:', error);
        return resp.status(500).json({
            success: false,
            message: 'Error fetching instructor courses',
            error: error.message
        });
    }
};

module.exports = { getInstructorStats, getInstructorCourses };
