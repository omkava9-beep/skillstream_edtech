const { instance } = require('../config/Razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const MailSender = require('../utils/Mailsender');
const courseEnrollmentEmail = require('../mail/templates/courseEnrollmentEmail');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const CourseProgress = require('../models/CourseProgress');

const CapturePayment = async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(403).json({
            message: 'error while retrieving courese id',
            success: false,
        });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: 'No data found for particular course id',
                success: false,
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'No data found for particular user id',
                success: false,
            })
        }

        // Check if user is already enrolled
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(403).json({
                message: "The user has already joined this course previously",
                success: false,
            })
        }

        if (!course.price || isNaN(course.price)) {
            return res.status(400).json({
                message: 'Course price is invalid or not set',
                success: false,
            })
        }

        const options = {
            amount: course.price * 100, // Amount in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            notes: {
                userId,
                courseId
            }
        }

        const paymentResponse = await instance.orders.create(options);
        console.log("RAZORPAY ORDER CREATED:", paymentResponse);

        return res.status(200).json({
            success: true,
            message: 'the payment created successfully',
            orderId: paymentResponse.id,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })

    } catch (error) {
        console.error("CAPTURE PAYMENT ERROR:", error);
        return res.status(500).json({
            message: error.message || "Could not instantiate order",
            success: false,
            error: error
        })
    }
}

// Multi-Course Payment Handler for Cart
const CaptureMultipleCourses = async (req, res) => {
    const userId = req.user.id;
    const { courseIds } = req.body;  //Array of course IDs

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
        return res.status(403).json({
            message: 'Please provide valid course IDs',
            success: false,
        });
    }

    try {
        // Fetch all courses
        const courses = await Course.find({ _id: { $in: courseIds } });

        if (courses.length !== courseIds.length) {
            return res.status(404).json({
                message: 'Some courses not found',
                success: false,
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        // Check if user is already enrolled in any course
        const uid = new mongoose.Types.ObjectId(userId);
        const alreadyEnrolled = courses.filter(course =>
            course.studentsEnrolled.includes(uid)
        );

        if (alreadyEnrolled.length > 0) {
            return res.status(403).json({
                message: `Already enrolled in: ${alreadyEnrolled.map(c => c.courseName).join(', ')}`,
                success: false,
            });
        }

        // Calculate total amount
        const totalAmount = courses.reduce((sum, course) => sum + (course.price || 0), 0);

        if (totalAmount === 0 || isNaN(totalAmount)) {
            return res.status(400).json({
                message: 'Invalid total amount',
                success: false,
            });
        }

        const options = {
            amount: totalAmount * 100, // Amount in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            notes: {
                userId,
                courseIds: courseIds.join(','),  // Store as comma-separated string
                courseCount: courseIds.length
            }
        };

        const paymentResponse = await instance.orders.create(options);
        console.log("RAZORPAY MULTI-COURSE ORDER CREATED:", paymentResponse);

        return res.status(200).json({
            success: true,
            message: 'Multi-course order created successfully',
            orderId: paymentResponse.id,
            courseNames: courses.map(c => c.courseName).join(', '),
            courseCount: courses.length,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });

    } catch (error) {
        console.error("CAPTURE MULTIPLE COURSES ERROR:", error);
        return res.status(500).json({
            message: error.message || "Could not create multi-course order",
            success: false,
            error: error
        });
    }
};


const VerifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId || !userId) {
        return res.status(400).json({
            success: false,
            message: "Payment details are incomplete",
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Payment is verified, now enroll the student
        try {
            // 1. Enroll student in course
            const enrolledCourse = await Course.findByIdAndUpdate(
                courseId,
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not found" });
            }

            // 2. Add course to user's list and initialize course progress
            const newCourseProgress = await CourseProgress.create({
                courseID: courseId,
                completedVideos: [],
            });

            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: newCourseProgress._id,
                    },
                },
                { new: true }
            );

            // 3. Record the transaction in Payment history
            await Payment.create({
                userId,
                courseId,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                amount: enrolledCourse.price,
            });

            // 4. Send confirmation email
            try {
                const emailResponse = await MailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(
                        enrolledCourse.courseName,
                        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                    )
                );
                console.log("Email sent successfully: ", emailResponse.response);
            } catch (error) {
                console.error("Error occurred while sending mail: ", error);
            }

            return res.status(200).json({
                success: true,
                message: "Payment Verified and Student Enrolled",
            });

        } catch (error) {
            console.error("VERIFY PAYMENT ERROR:", error);
            return res.status(500).json({
                success: false,
                message: "Could not enroll student",
            });
        }
    }

    return res.status(400).json({ success: false, message: "Payment Failed" });
};

// Verify Multi-Course Payment
const VerifyMultipleCoursesPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseIds } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseIds || !userId) {
        return res.status(400).json({
            success: false,
            message: "Payment details are incomplete",
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Payment is verified, now enroll in all courses
        try {
            const enrolledCourses = [];
            const courseProgressIds = [];
            let totalAmount = 0;

            // Process each course
            for (const courseId of courseIds) {
                // 1. Enroll student in course
                const enrolledCourse = await Course.findByIdAndUpdate(
                    courseId,
                    { $push: { studentsEnrolled: userId } },
                    { new: true }
                );

                if (!enrolledCourse) {
                    console.error(`Course not found: ${courseId}`);
                    continue;
                }

                enrolledCourses.push(enrolledCourse);
                totalAmount += enrolledCourse.price || 0;

                // 2. Create course progress
                const newCourseProgress = await CourseProgress.create({
                    courseID: courseId,
                    completedVideos: [],
                });

                courseProgressIds.push(newCourseProgress._id);

                // 3. Record individual payment
                await Payment.create({
                    userId,
                    courseId,
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    amount: enrolledCourse.price,
                });
            }

            // 4. Update user with all courses and progress
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: { $each: courseIds },
                        courseProgress: { $each: courseProgressIds },
                    },
                },
                { new: true }
            );

            // 5. Send confirmation email
            try {
                const courseNames = enrolledCourses.map(c => c.courseName).join(', ');
                const emailResponse = await MailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled in ${enrolledCourses.length} Courses`,
                    `<h2>Congratulations ${enrolledStudent.firstName} ${enrolledStudent.lastName}!</h2>
                    <p>You have been successfully enrolled in the following courses:</p>
                    <ul>${enrolledCourses.map(c => `<li>${c.courseName}</li>`).join('')}</ul>
                    <p>Total Amount Paid: ₹${totalAmount}</p>
                    <p>Start learning now!</p>`
                );
                console.log("Email sent successfully: ", emailResponse.response);
            } catch (error) {
                console.error("Error occurred while sending mail: ", error);
            }

            return res.status(200).json({
                success: true,
                message: `Payment Verified and Student Enrolled in ${enrolledCourses.length} courses`,
                enrolledCount: enrolledCourses.length,
            });

        } catch (error) {
            console.error("VERIFY MULTI-COURSE PAYMENT ERROR:", error);
            return res.status(500).json({
                success: false,
                message: "Could not enroll student in all courses",
            });
        }
    }

    return res.status(400).json({ success: false, message: "Payment Failed" });
};

const VerifySignature = async (req, res) => {
    const webHookSecret = '123456789'
    const signature = req.headers['x-razorpay-signature'];

    const shasum = crypto.createHmac("sha256", webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === signature) {
        console.log("PAYMENT IS AUTHORIZED");
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            // Enroll student in course
            const updateCourse = await Course.findByIdAndUpdate(
                courseId,
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!updateCourse) {
                return res.status(500).json({
                    message: "Course not found for enrollment",
                    success: false,
                })
            }

            // Add course to user's list
            const updateUser = await User.findByIdAndUpdate(
                userId,
                { $push: { courses: courseId } },
                { new: true }
            );

            if (!updateUser) {
                return res.status(500).json({
                    message: "User not found for enrollment update",
                    success: false,
                })
            }

            // Send Confirmation Email
            try {
                const emailResponse = await MailSender(
                    updateUser.email,
                    "Course Enrollment Confirmation",
                    courseEnrollmentEmail(updateCourse.courseName, `${updateUser.firstName} ${updateUser.lastName}`)
                );
                console.log("ENROLLMENT EMAIL SENT:", emailResponse);
            } catch (e) {
                console.error("EMAIL SENDING ERROR:", e);
            }

            return res.status(200).json({
                message: 'the user enrolled successfully ',
                success: true,
            });

        } catch (error) {
            console.error("SIGNATURE VERIFICATION INTERNAL ERROR:", error);
            return res.status(500).json({
                message: 'Internal server error during enrollment',
                success: false,
                error: error.message
            })
        }
    } else {
        return res.status(403).json({
            message: 'Signature mismatch',
            success: false
        })
    }
}

const GetPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await Payment.find({ userId })
            .populate("courseId")
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        console.error("GET PAYMENT HISTORY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Could not fetch payment history",
        });
    }
};

module.exports = {
    CapturePayment,
    VerifyPayment,
    CaptureMultipleCourses,
    VerifyMultipleCoursesPayment,
    VerifySignature,
    GetPaymentHistory
};

