const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const { cloudinary } = require('../config/couldinary');
const bcrypt = require('bcrypt');
const { convertSecondsToDuration } = require("../utils/secToDuration");
const UpdateProfile = async (req, resp) => {
    try {
        const { firstName, lastName, gender, dateOfBirth, about, contact, linkedinProfile } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return resp.status(404).json({
                message: "The user with this key does not exist",
                success: false,
            });
        }
        const profileId = user.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        await user.save();

        if (gender) {
            profileDetails.gender = gender;
        }
        if (dateOfBirth) {
            profileDetails.dateOfBirth = dateOfBirth;
        }
        if (about) {
            profileDetails.about = about;
        }
        if (contact) {
            profileDetails.contact = contact;
        }
        if (linkedinProfile) {
            profileDetails.linkedinProfile = linkedinProfile;
        }

        await profileDetails.save();

        const updatedUserDetails = await User.findById(userId).populate("additionalDetails")

        return resp.status(200).json({
            success: true,
            message: 'Profile updated Successfully',
            updatedUserDetails
        })
    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: 'Something went Wrong',
            error: error.message
        })
    }
}
const DeleteAccount = async (req, resp) => {
    try {
        const { password } = req.body;

        const userId = req.user.id;
        const user = await User.findById(userId);
        const profileId = user.additionalDetails;
        if (!user) {
            return resp.status(403).json({
                message: 'UserId not found in userdata',
                success: false,
            })
        }
        try {

            if (!await bcrypt.compare(password, user.password)) {
                return resp.status(403).json({
                    message: "please enter the right password to Delete this account",
                    success: false,
                })
            }
            await Course.updateMany(
                { studentsEnrolled: userId },
                { $pull: { studentsEnrolled: userId } }
            );
            await CourseProgress.deleteMany({ userId: userId });

            await User.findByIdAndDelete(userId);

            await Profile.findByIdAndDelete(profileId);

        } catch (e) {
            return resp.status(403).json({
                message: `error occured while deleting the account :- ${e.message}`,
                success: false

            })
        }

        return resp.status(200).json({
            message: 'User deleted Successfully',
            success: true,
        });

    } catch (error) {
        return resp.status(500).json({
            message: `Something went Wrong :- ${error.message}`,
            success: false,
        });

    }
}
const uploadProfilePicture = async (req, resp) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return resp.status(403).json({
                message: 'UserId not found in userdata',
                success: false,
            })
        }
        const profileId = user.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        if (!profileDetails) {
            return resp.status(403).json({
                message: 'Profile details not found for this user',
                success: false,
            })
        }
        if (!req.files || !req.files.profilePicture) {
            return resp.status(400).json({
                message: 'No profile picture uploaded',
                success: false,
            })
        }
        const profilePicture = req.files.profilePicture;
        const result = await cloudinary.uploader.upload(profilePicture.tempFilePath, {
            folder: 'profilePictures',
            resource_type: "auto"
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: result.secure_url },
            { new: true }
        );

        return resp.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            data: updatedUser
        });
    } catch (e) {
        console.log("Error while updating profile picture:", e);
        const errorMessage = e?.message || JSON.stringify(e) || 'Unknown error';
        resp.status(500).json({
            message: `Something went wrong while updating profile picture :- ${errorMessage}`,
            success: false,
        });
    }
}
const GetAllUsersDetails = async (req, resp) => {
    try {
        const users = await User.find().populate('additionalDetails');
        return resp.status(200).json({
            success: true,
            message: 'All Users Details fetched Successfully',
            users
        })
    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: `Something went Wrong :- ${error.message}`,
        });
    }
}

const GetEnrolledCourses = async (req, resp) => {
    try {
        const userId = req.user.id;

        // Fetch user with courses and courseProgress populated
        let user = await User.findById(userId)
            .populate({
                path: "courses",
                populate: [
                    {
                        path: "courseContent",
                        populate: {
                            path: "subSection",
                        },
                    },
                    {
                        path: "instructor",
                    }
                ],
            })
            .populate("courseProgress")
            .exec();

        if (!user) {
            return resp.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Convert to plain object to modify
        user = user.toObject();

        const enrolledCourses = user.courses.map((course) => {
            let totalDurationInSeconds = 0;
            let totalSubsections = 0;

            course.courseContent.forEach((section) => {
                totalSubsections += section.subSection.length;
                section.subSection.forEach((sub) => {
                    totalDurationInSeconds += parseInt(sub.timeDuration || 0);
                });
            });

            course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

            // Find progress for this specific course
            const courseProgress = user.courseProgress.find(
                (cp) => cp.courseID.toString() === course._id.toString()
            );

            const completedVideos = courseProgress ? courseProgress.completedVideos.length : 0;

            if (totalSubsections === 0) {
                course.progressPercentage = 0; // If no content, progress is 0
            } else {
                const multiplier = Math.pow(10, 2);
                course.progressPercentage =
                    Math.round((completedVideos / totalSubsections) * 100 * multiplier) / multiplier;
            }

            return course;
        });

        return resp.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully",
            courses: enrolledCourses
        });

    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}
module.exports = { UpdateProfile, DeleteAccount, GetAllUsersDetails, GetEnrolledCourses, uploadProfilePicture };