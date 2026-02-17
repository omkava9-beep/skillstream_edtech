const express = require('express');
const path = require('path');
const app = express();
const dbConnect = require('./config/database');
const userRoute = require('./routes/User')
const contactRoute = require('./routes/Contact')
const paymentRoute = require('./routes/Payment')
const courseRoute = require('./routes/Course')
const profileRoute = require('./routes/Profile')
const ratingRoute = require('./routes/Rating');
const { cloudinaryConnect } = require('./config/couldinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

app.use(express.json());
app.use(require('cookie-parser')());

app.use(
    cors({
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
)
dbConnect();
cloudinaryConnect();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/contact', contactRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/rating', ratingRoute);


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`app listening to port number ${port}`);
})

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, resp) => {
    resp.status(200).send('welcome to e-learning platform server');
})

// Fallback route for SPA - serves index.html for any unknown requests
// Compatible with Express 5 path matching
app.get('/:path*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
