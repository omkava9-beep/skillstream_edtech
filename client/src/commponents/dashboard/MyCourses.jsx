import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiConnector';
import { instructorEndpoints, courseEndpoints } from '../../../services/apis';
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiMoreVertical } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Loader from '../common/Loader';

const MyCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await apiConnector(
                "GET",
                instructorEndpoints.GET_INSTRUCTOR_COURSES_API,
                null,
                {
                    Authorization: `Bearer ${token}`,
                }
            );

            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching instructor courses:", error);
            toast.error("Could not fetch your courses");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleEdit = (courseId) => {
        // Placeholder for edit functionality
        toast.success("Edit functionality coming soon!");
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            setLoading(true);
            try {
                const response = await apiConnector(
                    "DELETE",
                    courseEndpoints.DELETE_COURSE_API,
                    { courseId },
                    {
                        Authorization: `Bearer ${token}`,
                    }
                );

                if (response.data.success) {
                    toast.success("Course deleted successfully");
                    // Refresh the list
                    fetchCourses();
                }
            } catch (error) {
                console.error("Error deleting course:", error);
                toast.error("Could not delete course");
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-richblack-5 mb-2">My Courses</h1>
                    <p className="text-richblack-300">Manage and track all your created courses here</p>
                </div>
                <button
                    onClick={() => navigate("/dashboard/add-course")}
                    className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-100 transition-all duration-200 hover:scale-105"
                >
                    <FiPlus size={20} />
                    Add Course
                </button>
            </div>

            {/* Courses Table/List */}
            {courses.length === 0 ? (
                <div className="bg-richblack-800 rounded-2xl border border-richblack-700 p-12 text-center">
                    <div className="bg-richblack-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle size={40} className="text-richblack-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-richblack-5 mb-3">No Courses Yet</h2>
                    <p className="text-richblack-300 mb-8 max-w-md mx-auto">
                        You haven't created any courses yet. Start sharing your knowledge by creating your first course today!
                    </p>
                    <button
                        onClick={() => navigate("/dashboard/add-course")}
                        className="bg-yellow-50 text-richblack-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-100 transition-all"
                    >
                        Create My First Course
                    </button>
                </div>
            ) : (
                <div className="bg-richblack-800 rounded-2xl border border-richblack-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-richblack-700/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-richblack-200 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-richblack-200 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-richblack-200 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-richblack-200 uppercase tracking-wider">Enrollments</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-richblack-200 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-richblack-700">
                                {courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-richblack-700/30 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-14 rounded-lg overflow-hidden bg-richblack-700 shrink-0">
                                                    <img 
                                                        src={course.thumbnail} 
                                                        alt={course.courseName}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <p className="text-richblack-5 font-bold truncate text-base mb-1 group-hover:text-yellow-100 transition-colors">
                                                        {course.courseName}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-richblack-400 text-xs">
                                                        <span className="flex items-center gap-1">
                                                            <FiClock size={12} />
                                                            {course.courseContent?.length || 0} Sections
                                                        </span>
                                                        <span>•</span>
                                                        <span>{new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-richblack-5 font-semibold">
                                            ₹{course.price}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                {course.status === "Published" ? (
                                                    <span className="flex items-center gap-1 text-caribbeangreen-200 text-xs font-bold leading-none bg-caribbeangreen-700/20 px-2 py-1.5 rounded-full border border-caribbeangreen-700/50">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-caribbeangreen-200 animate-pulse"></div>
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-yellow-100 text-xs font-bold leading-none bg-yellow-700/20 px-2 py-1.5 rounded-full border border-yellow-700/50">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-100"></div>
                                                        Draft
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-richblack-5 font-medium">{course.studentsCount || 0}</p>
                                            <p className="text-richblack-400 text-[10px] uppercase">Students</p>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 text-richblack-400">
                                                <button
                                                    onClick={() => handleEdit(course._id)}
                                                    className="hover:text-caribbeangreen-200 transition-colors bg-richblack-700/50 p-2 rounded-lg hover:bg-richblack-600"
                                                    title="Edit Course"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="hover:text-pink-200 transition-colors bg-richblack-700/50 p-2 rounded-lg hover:bg-richblack-600"
                                                    title="Delete Course"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table Footer / Pagination stats */}
                    <div className="bg-richblack-700/30 px-6 py-4 flex justify-between items-center text-xs text-richblack-400">
                        <p>Showing {courses.length} courses</p>
                        <p>Refined Dashboard UI • Premium Mode</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCourses;
