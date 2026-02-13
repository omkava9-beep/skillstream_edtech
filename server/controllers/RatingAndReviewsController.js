const RatingAndReviews = require('../models/RatingAndReviews');
const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');

const CreateRatingAndReviews = async (req, resp) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!course) {

            return resp.status(403).json({
                message: 'Course not found',
                success: false,
            })
        }
        if (!user) {
            return resp.status(403).json({
                message: 'User not found',
                success: false,
            })
        }
        if (!user.courses.some((course) => course.toString() === courseId.toString())) {
            console.log("Enrollment Check Failed. User Courses:", user.courses, "Target Course:", courseId);
            return resp.status(403).json({
                message: 'User has not enrolled in this course so cannot add rating and reveiw without enrolling',
                success: false,
            })
        }
        //check if the user has already rating and review for this course or  not 
        const alreadyReviewed = await RatingAndReviews.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed) {
            console.log("Already Reviewed Check Failed. User:", userId, "Course:", courseId);
            return resp.status(403).json({
                message: 'User has already submitted rating and review for this course',
                success: false,
            })
        }



        const newRatingAndReview = new RatingAndReviews({
            user: userId,
            rating,
            review,
            course: courseId,
        });
        await newRatingAndReview.save();

        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $push: {
                ratingAndReviews: newRatingAndReview._id,
            }
        }, { new: true });
        console.log(updatedCourse);

        return resp.status(200).json({
            message: 'Rating and Review added successfully',
            success: true,
            data: newRatingAndReview,
        })



    } catch (error) {

        return resp.status(500).json({
            message: error.message,
            success: false,
            error: error.message,
        })

    }


}

const getAverageRating = async (req, resp) => {
    try {

        const courseId = req.body.courseId || req.params.courseId;
        const course = await Course.findById(courseId).populate('ratingAndReviews');
        if (!course) {
            return resp.status(403).json({
                message: 'No course found with this id',
                success: false,
            })
        }


        const allratingAndReviews = course.ratingAndReviews;
        const result = await RatingAndReviews.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ],
        );

        if (result.length === 0) {
            return resp.status(200).json({
                message: 'Average rating fetched successfully',
                success: true,
                averageRating: 0,
            })
        }
        return resp.status(200).json({
            message: 'Average rating fetched successfully',
            success: true,
            averageRating: result[0].averageRating,
        })




    } catch (e) {
        return resp.status(500).json({
            message: 'Error while fetching average rating',
            success: false,
            error: error.message,
        })
    }

}


const GetAllRatingAndReviewsOfACourse = async (req, resp) => {
    try {
        const courseId = req.params.courseId;
        const filter = courseId ? { course: courseId } : {};
        const allReviews = await RatingAndReviews.find(filter).sort({ rating: "desc" }).populate({
            path: 'user',
            select: "firstName lastName email imageurl"
        }).populate(
            {
                path: 'course',
                select: 'courseName'
            }
        ).exec();
        return resp.status(200).json({
            message: 'All rating and reviews fetched successfully',
            success: true,
            data: allReviews

        })
    } catch (error) {
        return resp.status(500).json({
            message: 'Error while fetching all rating and reviews',
            success: false,
            error: error.message,
        })
    }
}


module.exports = { CreateRatingAndReviews, getAverageRating, GetAllRatingAndReviewsOfACourse };
