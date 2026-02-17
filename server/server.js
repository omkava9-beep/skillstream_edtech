const express = require('express');
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

const path = require("path");

dotenv.config();

dbConnect();
cloudinaryConnect();

app.use(express.json());
app.use(require('cookie-parser')());
app.use(
    cors({
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
)

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

// API Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/contact', contactRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/rating', ratingRoute);

// Serve Frontend
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// Fallback for SPA routing
app.get("*", (req, res) => {
    // Check if it's an API route that somehow hit this
    if (req.url.startsWith("/api/v1")) {
        return res.status(404).json({
            success: false,
            message: "API Route Not Found"
        });
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`app listening to port number ${port}`);
})
