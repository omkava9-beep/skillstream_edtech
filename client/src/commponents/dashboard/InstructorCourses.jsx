import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { HiUsers } from 'react-icons/hi';
import { BiRupee } from 'react-icons/bi';

const InstructorCourses = ({ courses }) => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);

    // Show only 3 courses initially
    const displayedCourses = showAll ? courses : courses.slice(0, 3);

    return (
        <div className="bg-gradient-to-br from-richblack-800 to-richblack-900 border border-richblack-700 rounded-lg p-4 shadow-lg hover:shadow-yellow-400/10 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-richblack-5">Your Courses</h2>
                <button
                    onClick={() => navigate('/dashboard/my-courses')}
                    className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-richblack-900 rounded-md font-semibold text-xs hover:scale-105 transition-all duration-200 shadow-md shadow-yellow-400/20"
                >
                    View All
                </button>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-richblack-300 text-sm">No courses created yet</p>
                    <button
                        onClick={() => navigate('/dashboard/add-course')}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-richblack-900 rounded-lg font-semibold text-sm hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-400/30"
                    >
                        Create Your First Course
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-richblack-700">
                                <th className="text-left py-2 px-2 text-richblack-100 font-semibold text-xs uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="text-center py-2 px-2 text-richblack-100 font-semibold text-xs uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="text-center py-2 px-2 text-richblack-100 font-semibold text-xs uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="text-center py-2 px-2 text-richblack-100 font-semibold text-xs uppercase tracking-wider">
                                    Students
                                </th>
                                <th className="text-center py-2 px-2 text-richblack-100 font-semibold text-xs uppercase tracking-wider">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedCourses.map((course, index) => (
                                <tr
                                    key={course._id}
                                    className="border-b border-richblack-700 hover:bg-richblack-700/30 transition-colors duration-200 cursor-pointer text-sm"
                                    onClick={() => navigate(`/dashboard/my-courses`)}
                                >
                                    <td className="py-2 px-2">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.courseName}
                                                className="w-12 h-12 rounded-lg object-cover border border-richblack-600"
                                            />
                                            <div className="flex flex-col">
                                                <p className="text-richblack-5 font-semibold line-clamp-1 text-sm">
                                                    {course.courseName}
                                                </p>
                                                <p className="text-richblack-300 text-xs line-clamp-1">
                                                    {course.courseDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 text-center text-xs">
                                        <span className="text-richblack-100">
                                            {course.courseContent?.length || 0} sections
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <BiRupee className="text-yellow-400" size={14} />
                                            <span className="text-richblack-5 font-semibold text-sm">
                                                {course.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <HiUsers className="text-blue-400" size={14} />
                                            <span className="text-richblack-5 font-semibold text-sm">
                                                {course.studentsEnrolled}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <BiRupee className="text-green-400" size={14} />
                                            <span className="text-green-400 font-bold text-sm">
                                                {course.revenue.toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {courses.length > 3 && !showAll && (
                        <div className="mt-3 text-center">
                            <button
                                onClick={() => setShowAll(true)}
                                className="text-yellow-400 hover:text-yellow-300 font-semibold text-xs transition-colors duration-200"
                            >
                                Show More ({courses.length - 3} more)
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InstructorCourses;
