const MailSender = require("../utils/Mailsender");

const ContactUs = async (req, resp) =>{
    try {
        const {email , firstname , lastname , message , phoneNo , countryCode } = req.body;


        if(!email || !firstname || !lastname || !message || !phoneNo || !countryCode){
            return resp.status(400).json({
                message:'All fields are required',
                success:false,
            })
        }

        const mailsent = await MailSender(email , 'We have received your message' ,
        `Hello ${firstname} ${lastname} , We have received your message. We will get back to you soon.`);

        const mailtoAdmin = await MailSender('omkava9@gmail.com', 'New Contact Us Message',
        `Name: ${firstname} ${lastname}\nEmail: ${email}\nPhone Number: ${countryCode}-${phoneNo}\nMessage: ${message}`);

        return resp.status(200).json({
            message:'Message sent successfully',
            success:true,
        })
    } catch (error) {
        return resp.status(500).json({
            message:'Error while sending message',
            success:false,
            error:error.message,
        })
    }
}

module.exports = {ContactUs}