const mongoose = require('mongoose');
const MailSender = require('../utils/Mailsender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate');

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,

    },
    otp: {
        type: String,
        required: true,

    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, //otp will expire in 5 minutes
    }
})

const SendVerificationEmail = async (email, otp) => {
    try {
        const emailTemplate = otpTemplate(otp);
        const mailResponse = await MailSender(email, "Email Verification - OTP", emailTemplate);
        console.log("Email Sent Successfully", mailResponse);

    } catch (e) {
        console.error("error occured while sending mail:-", e);
        throw e;
    }
}

OtpSchema.pre('save', async function () {
    try {
        await SendVerificationEmail(this.email, this.otp);
    } catch (error) {
        throw error;
    }
});
module.exports = mongoose.model('Otp', OtpSchema);