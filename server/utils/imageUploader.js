const cloudinary = require('cloudinary').v2;

const imageUploder = async(imagePath , folder , height , quality)=>{
    try{
        const options = {
            folder,
            resource_type: "auto",
        }
        if(height){
            options.height = height
        }
        if(quality){
            options.quality = quality;
        }
        // Handle both string path and object with tempFilePath
        const pathToUpload = typeof imagePath === 'string' ? imagePath : imagePath.tempFilePath;
        return await cloudinary.uploader.upload(pathToUpload, options);
    }catch(e){
        console.log('Error uploading image to cloudinary:', e);
        throw e;
    }

    
}

module.exports = imageUploder;
