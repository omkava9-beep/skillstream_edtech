const BASE_URL =    "https://skillstream-edtech-e9sb.vercel.app"  ||  "http://localhost:4000" ;

// const dev = "https://skillstream-edtech.onrender.com";


export const catagories = {
    CATAGORIES_API: `${BASE_URL}/api/v1/course/showallcatagories`,
}

export const courseEndpoints = {
    GET_ALL_COURSE_API: `${BASE_URL}/api/v1/course/getallcourses`,
    GET_COURSE: `${BASE_URL}/api/v1/course/getcourse`,
    CREATE_COURSE_API: `${BASE_URL}/api/v1/course/createcourse`,
    CREATE_SECTION_API: `${BASE_URL}/api/v1/course/createsection`,
    CREATE_SUBSECTION_API: `${BASE_URL}/api/v1/course/createsubsection`,
    DELETE_COURSE_API: `${BASE_URL}/api/v1/course/deletecourse`,
    EDIT_COURSE_API: `${BASE_URL}/api/v1/course/editcourse`,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED: `${BASE_URL}/api/v1/course/getFullCourseDetails`,
    LECTURE_COMPLETION_API: `${BASE_URL}/api/v1/course/updateCourseProgress`,
    UPDATE_SECTION_API: `${BASE_URL}/api/v1/course/updatesection`,
    UPDATE_SUBSECTION_API: `${BASE_URL}/api/v1/course/updatesubsection`,
}

export const instructorEndpoints = {
    GET_INSTRUCTOR_STATS_API: `${BASE_URL}/api/v1/course/instructor/stats`,
    GET_INSTRUCTOR_COURSES_API: `${BASE_URL}/api/v1/course/instructor/courses`
}

export const auth = {
    AUTH_API: `${BASE_URL}/api/v1/user/login`,
    SIGNUP_API: `${BASE_URL}/api/v1/user/signup`,
    SENDOTP_API: `${BASE_URL}/api/v1/user/sendotp`,
    MAIL_SENDER_API: `${BASE_URL}/api/v1/user/reset-password-token`,
    CHANGE_PASSWORD_API: `${BASE_URL}/api/v1/user/reset-password`
}

export const contact = {
    CONTACT_API: `${BASE_URL}/api/v1/contact/contactus`
}

export const catagorypage = {
    CATAGORY_PAGE_API: `${BASE_URL}/api/v1/course/getcatgorypagedetails/`
}

export const profile = {
    UPDATE_PROFILE_API: `${BASE_URL}/api/v1/profile/updateprofile`,
    DELETE_ACCOUNT_API: `${BASE_URL}/api/v1/profile/deleteaccount`,
    GET_ALL_USERS_API: `${BASE_URL}/api/v1/profile/getallusers`,
    GET_ENROLLED_COURSES_API: `${BASE_URL}/api/v1/profile/getenrolledcourses`,
    UPLOAD_PROFILE_PICTURE_API: `${BASE_URL}/api/v1/profile/uploadprofilepicture`,
}

export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: `${BASE_URL}/api/v1/profile/uploadprofilepicture`,
    UPDATE_PROFILE_API: `${BASE_URL}/api/v1/profile/updateprofile`,
    CHANGE_PASSWORD_API: `${BASE_URL}/api/v1/user/changepassword`,
    DELETE_PROFILE_API: `${BASE_URL}/api/v1/profile/deleteaccount`,
}

export const paymentEndpoints = {
    CREATE_ORDER_API: `${BASE_URL}/api/v1/payment/createorder`,
    VERIFY_PAYMENT_API: `${BASE_URL}/api/v1/payment/verifyPayment`,
    CREATE_MULTI_ORDER_API: `${BASE_URL}/api/v1/payment/createmultiorder`,
    VERIFY_MULTI_PAYMENT_API: `${BASE_URL}/api/v1/payment/verifymultipayment`,
    GET_PAYMENT_HISTORY_API: `${BASE_URL}/api/v1/payment/getPaymentHistory`,
}

export const ratingsEndpoints = {
    REVIEW_DETAILS_API: `${BASE_URL}/api/v1/rating/getallratings`,
    CREATE_RATING_API: `${BASE_URL}/api/v1/rating/createrating`,
}
