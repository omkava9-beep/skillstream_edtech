const Profile = require('../models/Profile');
const User = require('../models/User');


const UpdateProfile = async(req , resp)=>{
    try {
        const {gender ,dateOfBirth , about , contact , linkedinProfile} = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if(!user){
            return resp.status(404).json({
                message:"The user with this key does not exist",
                success:false,
            });
        }
        const profileId = user.additionalDetails;
        const profileDetails = await Profile.findById(profileId)
        if(gender){
            profileDetails.gender = gender;
        }
        if(dateOfBirth){
            profileDetails.dateOfBirth = dateOfBirth;
        }
        if(about){
            profileDetails.about = about;
        }
        if(contact){
            profileDetails.contact = contact;
        }
        if(linkedinProfile){
            profileDetails.linkedinProfile = linkedinProfile;
        }

        await profileDetails.save();
        return resp.status(200).json({
            success:true,
            message:'Profile updated Successfully',
            profileDetails
        })
    } catch (error) {
        return resp.status(500).json({
            success:false,
            message:'Something went Wrong',
            error : error.message
        })
    }
}
const DeleteAccount = async(req,resp)=>{
    try {
        const userId = req.user.id;
        const user = await user.findById(userId);
        const profileId = user.profileDetails;
        if(!user){
            return resp.status(403).json({
                message:'UserId not found in userdata',
                success:false,
            })
        }
        try{
            await User.findByIdAndDelete(userId);
    
            await Profile.findByIdAndDelete(profileId);

        }catch(e){
            return resp.status(403).json({
                message:`error occored while deleting the account :-${e.message}`,
                success:false

            })
        }
        //UnEnroll all the Students from enrollled Courses.
        return resp.status(200).json({
            message:'User deleted Successfully',
            success:true,
        });
        
    } catch (error) {
        return resp.status(500).json({
            message:`Something went Wrong :- ${error.message}`,
            success:true,
        });
        
    }
    
}
const GetAllUsersDetails = async(req,resp)=>{
    try {
        const users = await User.find().populate('additionalDetails');  
        return resp.status(200).json({
            success:true,
            message:'All Users Details fetched Successfully',
            users
        })
    } catch (error) {
        return resp.status(500).json({
            success:false,
            message:`Something went Wrong :- ${error.message}`,
        });
    }
}
module.exports = {UpdateProfile,DeleteAccount,GetAllUsersDetails};