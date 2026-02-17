import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiConnector';
import { instructorEndpoints, courseEndpoints } from '../../../services/apis';
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
// FIXED: Path typo from commponents to components
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
                { Authorization: `Bearer ${token}` }
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
        navigate(`/dashboard/edit-course/${courseId}`);
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            setLoading(true);
            try {
                const response = await apiConnector(
                    "DELETE",
                    courseEndpoints.DELETE_COURSE_API,
                    { courseId },
                    { Authorization: `Bearer ${token}` }
                );

                if (response.data.success) {
                    toast.success("Course deleted successfully");
                    fetchCourses();
                }
            } catch (error) {
                console.error("Error deleting course:", error);
                toast.error("Could not delete course");
                setLoading(false);
            }
        }
    };

    if (loading) return <Loader />;

    return (
        /* FIX: Added 'pt-14 lg:pt-0' 
           This ensures that on mobile, the 'My Courses' title starts below the 
           fixed Sidebar/Menu button instead of being hidden by it.
        */
        <div className="w-full space-y-8 pt-14 lg:pt-0 pb-10">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-richblack-5 tracking-tight">
                        My <span className="text-yellow-100">Courses</span>
                    </h1>
                    <p className="text-richblack-400 mt-1">Manage and track your curriculum</p>
                </div>
                <button
                    onClick={() => navigate("/dashboard/add-course")}
                    className="flex items-center gap-2 bg-yellow-100 text-richblack-900 px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,214,10,0.3)] transition-all duration-300 hover:scale-[1.02]"
                >
                    <FiPlus size={20} />
                    <span>Create Course</span>
                </button>
            </div>

            {/* Courses Table/List */}
            {courses.length === 0 ? (
                <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-10 md:p-16 text-center backdrop-blur-sm">
                    <div className="bg-richblack-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <FiCheckCircle size={40} className="text-richblack-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-richblack-5 mb-2">No courses found</h2>
                    <p className="text-richblack-400 mb-8 max-w-sm mx-auto">
                        Your catalog is empty. Start by adding your first course to the platform.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard/add-course")}
                        className="text-yellow-100 font-bold hover:underline"
                    >
                        Click here to get started
                    </button>
                </div>
            ) : (
                <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden backdrop-blur-md">
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-5 text-xs font-bold text-richblack-400 uppercase tracking-widest">Course Info</th>
                                    <th className="px-6 py-5 text-xs font-bold text-richblack-400 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-5 text-xs font-bold text-richblack-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-xs font-bold text-richblack-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-28 h-16 rounded-xl overflow-hidden bg-richblack-800 shrink-0 border border-white/5">
                                                    <img 
                                                        src={course.thumbnail} 
                                                        alt={course.courseName}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-richblack-5 font-bold text-lg group-hover:text-yellow-100 transition-colors line-clamp-1">
                                                        {course.courseName}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-richblack-400 text-xs">
                                                        <span className="flex items-center gap-1">
                                                            <FiClock size={12} />
                                                            {new Date(course.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className="bg-richblack-700 h-1 w-1 rounded-full"></span>
                                                        <span>{course.courseContent?.length || 0} Modules</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-richblack-5 font-bold text-base">₹{course.price}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            {course.status === "Published" ? (
                                                <div className="flex items-center gap-2 text-caribbeangreen-300 bg-caribbeangreen-300/10 w-fit px-3 py-1 rounded-full border border-caribbeangreen-300/20 text-[10px] font-black uppercase tracking-tighter">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-caribbeangreen-300 animate-pulse"></div>
                                                    Published
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-yellow-100 bg-yellow-100/10 w-fit px-3 py-1 rounded-full border border-yellow-100/20 text-[10px] font-black uppercase tracking-tighter">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-100"></div>
                                                    Draft
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(course._id)}
                                                    className="p-2 rounded-lg bg-richblack-800 text-richblack-300 hover:text-yellow-100 hover:bg-richblack-700 border border-white/5 transition-all"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course._id)}
                                                    className="p-2 rounded-lg bg-richblack-800 text-richblack-300 hover:text-pink-200 hover:bg-pink-500/10 border border-white/5 transition-all"
                                                    title="Delete"
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

                    {/* Mobile View (Cards) */}
                    <div className="md:hidden flex flex-col gap-4 p-4">
                        {courses.map((course) => (
                            <div key={course._id} className="bg-richblack-800 rounded-xl p-4 border border-white/5 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-richblack-700 shrink-0 border border-white/5">
                                        <img 
                                            src={course.thumbnail} 
                                            alt={course.courseName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <h3 className="text-richblack-5 font-bold text-base line-clamp-1">{course.courseName}</h3>
                                        <div className="flex items-center gap-2 text-richblack-400 text-[10px]">
                                            <span className="flex items-center gap-1">
                                                <FiClock size={10} />
                                                {new Date(course.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="bg-richblack-600 h-1 w-1 rounded-full"></span>
                                            <span>{course.courseContent?.length || 0} Modules</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-richblack-5 font-bold text-lg">₹{course.price}</span>
                                        {course.status === "Published" ? (
                                            <div className="flex items-center gap-1.5 text-caribbeangreen-300 bg-caribbeangreen-300/10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                                <div className="w-1 h-1 rounded-full bg-caribbeangreen-300"></div>
                                                Published
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-yellow-100 bg-yellow-100/10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                                <div className="w-1 h-1 rounded-full bg-yellow-100"></div>
                                                Draft
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(course._id)}
                                            className="p-2 rounded-lg bg-richblack-700 text-richblack-200 hover:text-yellow-100 hover:bg-richblack-600 transition-all"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
                                            className="p-2 rounded-lg bg-richblack-700 text-richblack-200 hover:text-pink-200 hover:bg-pink-900/20 transition-all"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCourses;