const BASE_URL = "http://localhost:4000";

export const catagories = {
    CATAGORIES_API: `${BASE_URL}/api/v1/course/showallcatagories`,
}

export const courseEndpoints = {
    GET_ALL_COURSE_API: `${BASE_URL}/api/v1/course/getallcourses`,
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