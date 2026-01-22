const jwt = require('jsonwebtoken');

const cookieparser = require('cookie-parser');

const User = require('../models/User');

const auth = async (req, resp, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', "") || req.cookies.token || req.body.token;

        if (!token) {
            return resp.status(401).json({
                success: false,
                message: "Token Missing from request!"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (e) {
            console.log(e);
            return resp.status(401).json(
                {
                    message: 'token is invalid',
                    success: false,
                }
            )
        }
        next();
    } catch (e) {
        console.log(e);
        resp.status(401).json({
            success: false,
            message: 'error occured while authorization process',
        })
    }

}

const isStudent = async (req, resp, next) => {
    try {
        const { role } = req.user;
        if (!role) {
            return resp.status(400).json({
                message: "something went wrong in isStudent",
                success: false
            })
        }
        if (role !== 'Student') {
            return resp.status(403).json({
                message: "this route is only for Student account",
                success: false
            })
        }
        next();

    } catch (e) {
        console.log(e);
        return resp.status(500).json({
            message: "Internal server error in isStudent middleware",
            success: false
        })
    }
}

const isInstructor = async (req, resp, next) => {
    try {
        const { role } = req.user;
        if (!role) {
            return resp.status(400).json({
                message: "something went wrong in isInstructor",
                success: false
            })
        }
        if (role !== 'Instructor') {
            return resp.status(403).json({
                message: "this route is only for Instructor account",
                success: false
            })
        }
        next();
    } catch (e) {
        console.log(e);
        return resp.status(500).json({
            message: "Internal server error in isInstructor middleware",
            success: false
        })
    }

}

const isAdmin = async (req, resp, next) => {
    try {
        const { role } = req.user;
        if (!role) {
            return resp.status(400).json({
                message: "something went wrong in isAdmin",
                success: false
            })
        }
        if (role !== 'Admin') {
            return resp.status(403).json({
                message: "this route is only for Admin account",
                success: false
            })
        }
        next();
    } catch (e) {
        console.log(e);
        return resp.status(500).json({
            message: "Internal server error in isAdmin middleware",
            success: false
        })
    }

}
module.exports = { auth, isStudent, isInstructor, isAdmin };
