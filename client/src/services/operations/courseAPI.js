import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { instructorEndpoints } from "../../../services/apis";

const { GET_INSTRUCTOR_STATS_API, GET_INSTRUCTOR_COURSES_API } = instructorEndpoints;

// Get instructor statistics
export const getInstructorStats = async (token) => {
    const toastId = toast.loading("Loading statistics...");
    let result = null;

    try {
        const response = await apiConnector(
            "GET",
            GET_INSTRUCTOR_STATS_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        toast.success("Statistics loaded successfully");
    } catch (error) {
        console.error("GET_INSTRUCTOR_STATS_API ERROR:", error);
        toast.error(error?.response?.data?.message || "Could not fetch statistics");
    }

    toast.dismiss(toastId);
    return result;
};

// Get instructor courses
export const getInstructorCourses = async (token) => {
    const toastId = toast.loading("Loading courses...");
    let result = null;

    try {
        const response = await apiConnector(
            "GET",
            GET_INSTRUCTOR_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        toast.success("Courses loaded successfully");
    } catch (error) {
        console.error("GET_INSTRUCTOR_COURSES_API ERROR:", error);
        toast.error(error?.response?.data?.message || "Could not fetch courses");
    }

    toast.dismiss(toastId);
    return result;
};
