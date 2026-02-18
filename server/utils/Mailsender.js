const nodemailer = require('nodemailer');


const MailSender = async (email, title, body) => {
    try {
        // Diagnostic check: This will show up in Render logs if variables are missing
        if (!process.env.MAIL_USER) console.error("MAIL_USER is missing in environment");
        if (!process.env.MAIL_PASS) console.error("MAIL_PASS is missing in environment");

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                // This helps if Render's network uses a proxy or has cert issues
                rejectUnauthorized: false
            },
            connectionTimeout: 20000, // Increase to 20s for cloud starts
            debug: true,              // Enable debug output in logs
            logger: true              // Log every interaction
        })

        console.log("Attempting to send email via port 465 to:", email);

        let info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log("Email sent successfully! MessageID:", info.messageId);
        return info;
    } catch (e) {
        console.error("Detailed MailSender Error (including stack):", e);
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


