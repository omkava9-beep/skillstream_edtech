const cloudinary = require('cloudinary').v2;


const cloudinaryConnect = async() =>{
 try {
    cloudinary.config({
       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
       api_key: process.env.CLOUDINARY_API_KEY,
       api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    console.log('cloudinary connction successfull')

   
    
 } catch (error) {
    console.log(error);
    console.log("something went wrong")
    process.exit(1);
 }
}


module.exports = {cloudinaryConnect, cloudinary};