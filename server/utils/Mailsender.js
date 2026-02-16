const nodemailer = require('nodemailer');


const MailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from: 'StudyNotion',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        return info;
    } catch (e) {
        console.log(e.message);
        return null;
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


