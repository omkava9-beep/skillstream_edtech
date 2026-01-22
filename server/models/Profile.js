const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    firstName: {
        type:String,
    },
    lastName: {
        type:String,
    },
    gender : {
        type:String 
    },
    dateOfBirth : {
        type:String,

    },
    about:{
        type:String,
        trim : true,

    },
    contact:{
        type:Number,
        trim:true,
    },
    linkedinProfile:{
        type:String,
    }
})

module.exports = mongoose.model('Profile' , ProfileSchema);
