const BASE_URL = "http://localhost:4000";

export const catagories = {
    CATAGORIES_API: `${BASE_URL}/api/v1/course/showallcatagories`,
}

export const courseEndpoints = {
    GET_ALL_COURSE_API: `${BASE_URL}/api/v1/course/getallcourses`,
    GET_COURSE : `${BASE_URL}/api/v1/course/getcourse`
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

