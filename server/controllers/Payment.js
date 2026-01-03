const {instance} = require('../config/Razorpay');

const Course = require('../models/Course');
const User = require('../models/User');
const MailSender = require('../utils/Mailsender');
const courseEnrollmentEmail = require('../mail/templates/courseEnrollmentEmail');
const mongoose = require('mongoose');
const crypto = require('crypto');
const cryptojs = require('cryptojs');
const Razorpay = require('razorpay');

//capture the payment and intiate the razorpay order

// const CapturePayment = async(req , res) =>{
//     //get coureid and userid;
//     const {courseId } = req.body;
//     const userId = req.user.id; 
    
    
//     //validation 
//     //is this valid course id or not 
//     if(!courseId ){
//         return res.status(404).json({
//             message: 'the courseId does not exist',
//             success:false,
//         })
//     }
//     let courseDetails;
//     //check if the course is valid or not
//     try{
//         courseDetails = await Course.findById(courseId);
    
//         if(!courseDetails){
//             return res.status(404).json({
//                 message:"the course is'nt the valid one!",
//                 success:false,
//             })
//         }
//          const uId = new mongoose.Types.ObjectId(userId);
//         //if all validations are complete then 
//         if(courseDetails.enrolledStudents.includes(uId)){
//             return res.status(403).json({
//                 message:'the user already exist',
//                 success:false,

//             })
//         }



//     }catch(e){
//         return res.status(500).json({
//                 message:"something went wronf while capturing the payment can you please try again ",
//                 success:false,
//             });
//     }


//     //check if the user has already paid for this course or not
//     const amount = courseDetails.price;
//     const currency = 'INR';


//     const options = {
//         amount : amount*100,
//         currency : currency,
//         reciept : Math.random(Date.now()).toString(),
//         notes : {
//             courseId : courseId,
//             userId : userId
//         }
//     }

//     try{    
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         return res.status(200).json({
//             success:true,
//             message:'payment instance created successsfully',
//             courseName : courseDetails.courseName,
//             courseDescription : courseDetails.courseDescription,
//             orderId : paymentResponse.id,
//             currency : paymentResponse.currency,
//             amount : paymentResponse.amount,

//         })


//     }catch(e){
//         return res.status(500).json({
//             message:`Could not instanciate order..`,
//             success:false,
//         })
//     }
// }


const CapturePayment = async(req,resp)=>{
    const userId = req.user.id;

    const {courseId} = req.body;

    if(!courseId){
        return resp.status(403).json({
            message:'error while retrieving courese id',
            success:false,
        });
    }
    const course = await Course.findById(courseId);
    if(!course){
        return resp.status(403).json({
            message:'no data found for perticular course id',
            success:false,
        })
    }

    const user = await User.findById(userId);
    if(!user){
        return resp.status(403).json({
            message:'no data found for perticular user id',
            success:false,
        })
    }

    if(course.studentsEnrolled.includes(userId)){
        return resp.status(403).json({
            message:"the user has already joined this course previously",
            success:false,
        })
    }
    const options = {
        amount : course.price,
        currency : 'INR',
        reciept : Math.random(Date.now()).toString(),
        notes:{
            userId,
            courseId
        }
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        return resp.status(200).json({
            success:true,
            message:'the payment created successfully',
            orderId : paymentResponse.id,
            courseName:course.courseName,
            courseDescription : course.courseDescription,
            currency : paymentResponse.currency,
            amount : paymentResponse.amount, 
        })

    } catch (error) {
        return resp.status(500).json({
            message:`Could not instanciate order..`,
            success:false,
        })
    }

}
const VerifySignature = async(req,res)=>{
    const webHookSecret = '123456789'  
    const signature = req.headers['x-razorpay-signature'];
    const shasum = crypto.createHmac("sha256" ,webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    if(digest === signature){
        const {courseId , userId} = req.body.payload.payment.entity.notes;
        try {
            //fullfil the action 
            const updateCourse = await Course.findByIdAndUpdate(courseId , {
                $push:{
                    studentsEnrolled:userId
                }
            },{new:true});

            if(!updateCourse){
                return res.status(403).json({
                    message:"some error occured while pushing the coureid into user bought courses",
                    success:false,
                })
            }


            const updateUser = await User.findByIdAndUpdate(userId , {
                $push : {
                    courses:courseId,
                }
            },{new:true});
            if(!updateCourse){
                return res.status(403).json({
                    message:"some error occured while pushing the userid inside course enrolled students",
                    success:false,
                })
            }

            try{
                const emailResponse = await MailSender(updateUser.email , "Course Enrollment Email" , "courseEnrollmentEmail");
                console.log(emailResponse)
            }catch(e){
                console.log(e);
                return resp.status(500).json({
                    message:"Something went wrong while sending the mail",
                    success:false,
                })

            }

            return res.status(200).json({
                message:'the user enrolled successfully ',
                success:true,
            });

        } catch (error) {

            return res.status(500).json({
                message:'something went wrong',
                success:false,
            })
            
        }
    }else{
        return res.status(403).json({
            message:'the payment cannot be done because the digest is not matched with the secret',
            success:false
        })
    }

}
module.exports = {CapturePayment,VerifySignature};
