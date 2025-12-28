const Otp = require('../models/Otp');
const User = require('../models/User');
const otpGenerator = require('generate-otp')
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sendOtp = async(req ,resp)=>{
    try{
        const {email} = req.body;
        const exist  = await User.findOne({email});
        if(exist){
            return resp.status(401).json({
                success :false,
                message : "User Exist with this email already please try to login"
            })
        }
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        console.log("otp generated");
        let foundOtp = await Otp.findOne({otp});
        while(foundOtp){
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            foundOtp = await Otp.findOne({otp});
        }
        const newOtp = await Otp.create({email , otp});

        resp.status(200).json({
            success : true,
            message : 'otp sent successfully',
            otp,
        })
    }catch(e){
        console.log("error occured while generating and storing otp" ,e);
        return resp.status(500).json({
            success:false,
            message:"Error generating OTP"
        })
    }
}

const SignUp = async(req , resp)=>{
    try{
        const {firstName , lastName , email , password, confirmPassword , accountType , additionalDetails , contactNumber , otp} = req.body;
        // validate otp
        const validOtp = await Otp.findOne({email , otp});
        if(!validOtp){
            return resp.status(400).json({
                success : false,
                message : "Invalid Otp"
            })
        }       
        // check if user already exist
        const exist = await User.findOne({email});
        if(exist){
            return resp.status(401).json({
                success : false,
                message : "User exist with this email please try to login"
            })
        }

        if(!firstName ||!lastName ||!password ||!confirmPassword ||!accountType || !otp){
            return resp.status(403).json({
                success:false,
                message:'Field Missing!'
            })
        }
        //compare pass and confirm pass
        if(confirmPassword!== password){
            return resp.status(400).json({
                success:false,
                message:'Password does not match'
            })
        }

        const recentOtp = (await Otp.find({email})).sort({createdAt:-1}).limit(1);

        console.log(recentOtp);

        if(recentOtp.length === 0){
            return resp.status(400).json({
                success:false,
                message:"OTP not found",
            })
        }else if(otp !== recentOtp[0].otp){
            return resp.status(400).json({
                success : false,
                message:"Invalid OTP."
            })
        }
        const hashed = await bcrypt.hash(password, 10);

        //create entry
        const profile = await Profile.create({
            gender: null,
            dateOfBirth : null,
            about:null,
            contact:null,
            linkedinProfile:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email , 
            contactNumber,
            password : hashed,
            accountType,
            additionalDetails:Profile._id,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

        })

        resp.status(200).json({
            success:true,
            message:'user Created Succesfully',
            user,

        })
    }catch(e){
        console.log(e.message);
        console.log("error occured while signUp");
        return resp.status(500).json({
            message:"some error occured",
            success:false,

        })
    }

}
const Login = async(req, resp)=>{
    try{
        //get data from req body
        const {email, password,} = req.body;
         //validate the data

         if(!email || !password){
            return resp.status(403).json({
                success : false,
                message: 'all fields are required'
            });
         }
         //check if the user exist or not
         const Exist = await User.findOne({email});
         if(!Exist){
            return resp.status(401).json({
                message:"user does not exist with this email.. please Try to Signup",
                success:false
            });
         }
         //match the password 
         const passInDatabase = Exist.password;
        if(await bcrypt.compare(password , passInDatabase)){
               
            const payload = {
                email , 
                id :Exist._id ,
                role : Exist.accountType    
            }
            //generate jwt token 
         
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn:'8760h'
            })
            const user= Exist.toObject();

            user.token = token;
            user.password = undefined;
            //create cookie and send response
            resp.cookie("token" , token , {
                httpOnly : true,
                expires : new Date(Date.now() + 3*24*60*60*1000)
            }).status(200).json({
                success : true,
                token , 
                user,
                message : "Login Succesfull",
            })
           
        }else{
            return resp.status(403).json({
                success : false,
                message : "Incorrect Password"
            })
        }
    }
    catch(e){
        console.log(e);
        return resp.status(500).json({
            success : false,
            message : "Something went wrong while login"
        })
    }
}
//ChangePassword

const ChangePassword = async(req , resp)=>{
    try{
        const {oldPassword , newPassword , confirmNewPassword} = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return resp.status(404).json({
                success : false,
                message : "User not found"
            })
        }
        if(!await bcrypt.compare(oldPassword , user.password)){
            return resp.status(403).json({
                success : false,
                message : "Incorrect Old Password"
            })
        }
        if(newPassword !== confirmNewPassword){
            return resp.status(403).json({
                success : false,
                message : "New Password and Confirm New Password does not match"
            })
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId , {password:hashed});
        return resp.status(200).json({
            success : true,
            message : "Password Changed Successfully"
        })
    }catch(e){
        console.log(e);
        return resp.status(500).json({
            success : false,
            message : "Something went wrong while changing password"
        })
    }
}
module.exports = {sendOtp, SignUp , Login, ChangePassword};