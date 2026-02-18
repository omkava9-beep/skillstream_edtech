const nodemailer = require('nodemailer');


const MailSender = async (email, title, body) => {
    try {
        // Diagnostic check (don't log the password!)
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            console.error("Mail Error: Missing MAIL_USER or MAIL_PASS environment variables");
            throw new Error("SMTP Credentials missing");
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail', // Use service instead of host/port for Gmail
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            connectionTimeout: 15000, // 15 seconds
            greetingTimeout: 10000,   // 10 seconds
        })

        console.log("Attempting to send email to:", email);

        let info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log("Email sent successfully: ", info.messageId);
        return info;
    } catch (e) {
        console.error("Detailed MailSender Error:", e);
        throw e;
    }
}

module.exports = MailSender;

//table tag is used to display data in rows and columns in tabular format.
//tr tag  is used to specify the row of the table
//th tag is used to specify the table column or table header
//td tag is used to
//comon attributes of table is border: to specify the border of the table
// bg color is used to give backgroud color to the table
//colspan and rowspan
//colspan is used to merge two columns in a table
//rowspan is used to merge more than one rows in the table.


