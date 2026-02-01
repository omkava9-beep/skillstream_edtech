import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInstructorStats } from '../services/operations/courseAPI.js';
import Loader from '../commponents/common/Loader';
import InstructorChart from '../commponents/dashboard/InstructorChart';
import InstructorCourses from '../commponents/dashboard/InstructorCourses';
import { HiUsers } from 'react-icons/hi';
import { BiRupee, BiBook } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const InstructorDashBoard = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(true);
    const [instructorData, setInstructorData] = useState(null);

    useEffect(() => {
        const fetchInstructorData = async () => {
            setLoading(true);
            const result = await getInstructorStats(token);
            if (result) {
                setInstructorData(result);
            }
            setLoading(false);
        };

        fetchInstructorData();
    }, [token]);

    if (loading) {
        return <Loader />;
    }

    const totalStudents = instructorData?.totalStudents || 0;
    const totalCourses = instructorData?.totalCourses || 0;
    const totalRevenue = instructorData?.totalRevenue || 0;
    const courses = instructorData?.courses || [];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-richblack-800 to-richblack-900 border border-richblack-700 rounded-lg p-4 shadow-lg flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-richblack-5 mb-1">
                        Hi {user?.firstName} 👋
                    </h1>
                    <p className="text-richblack-300 text-sm">
                        Let's start something new today
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Courses Card */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-lg p-4 shadow-lg hover:shadow-blue-400/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-md">
                            <BiBook className="text-blue-400 text-xl" />
                        </div>
                        <span className="text-blue-400 text-xs font-semibold">COURSES</span>
                    </div>
                    <h3 className="text-2xl font-bold text-richblack-5 mb-1">{totalCourses}</h3>
                    <p className="text-richblack-300 text-xs">Total Courses</p>
                </div>

                {/* Total Students Card */}
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-lg p-4 shadow-lg hover:shadow-purple-400/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-md">
                            <HiUsers className="text-purple-400 text-xl" />
                        </div>
                        <span className="text-purple-400 text-xs font-semibold">STUDENTS</span>
                    </div>
                    <h3 className="text-2xl font-bold text-richblack-5 mb-1">{totalStudents}</h3>
                    <p className="text-richblack-300 text-xs">Total Students</p>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-lg p-4 shadow-lg hover:shadow-green-400/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-500/20 rounded-md">
                            <BiRupee className="text-green-400 text-xl" />
                        </div>
                        <span className="text-green-400 text-xs font-semibold">REVENUE</span>
                    </div>
                    <h3 className="text-2xl font-bold text-richblack-5 mb-1">
                        ₹{totalRevenue.toLocaleString()}
                    </h3>
                    <p className="text-richblack-300 text-xs">Total Revenue</p>
                </div>
            </div>

            {/* Chart Section */}
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <InstructorChart courses={courses} />
                    
                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-richblack-800 to-richblack-900 border border-richblack-700 rounded-lg p-4 shadow-lg hover:shadow-yellow-400/10 transition-all duration-300">
                        <h2 className="text-lg font-bold text-richblack-5 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                to="/dashboard/add-course"
                                className="block w-full p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-richblack-900 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-md shadow-yellow-400/20 text-center text-sm"
                            >
                                <span className="flex items-center justify-center gap-2">
                                     Create New Course
                                </span>
                            </Link>
                            <Link
                                to="/dashboard/my-courses"
                                className="block w-full p-3 bg-richblack-700 text-richblack-5 rounded-lg font-semibold hover:bg-richblack-600 transition-all duration-200 border border-richblack-600 text-center text-sm"
                            >
                                Manage Courses
                            </Link>
                            <Link
                                to="/dashboard/settings"
                                className="block w-full p-3 bg-richblack-700 text-richblack-5 rounded-lg font-semibold hover:bg-richblack-600 transition-all duration-200 border border-richblack-600 text-center text-sm"
                            >
                                Account Settings
                            </Link>
                        </div>

                        {/* Tips Section */}
                        <div className="mt-6 p-3 bg-richblack-700/50 border border-richblack-600 rounded-lg">
                            <h3 className="text-sm font-semibold text-yellow-400 mb-2">💡 Pro Tip</h3>
                             <p className="text-richblack-300 text-xs">
                                Engage with students regularly to boost course ratings and specific feedback.
                             </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-richblack-800 to-richblack-900 border border-richblack-700 rounded-lg p-8 text-center shadow-lg">
                    <div className="max-w-md mx-auto">
                        <BiBook className="text-5xl text-richblack-400 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-richblack-5 mb-2">
                            No Courses Yet
                        </h3>
                        <p className="text-richblack-300 mb-4 text-sm">
                            Start your teaching journey by creating your first course
                        </p>
                        <Link
                            to="/dashboard/add-course"
                            className="inline-block px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-richblack-900 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-400/30 text-sm"
                        >
                            Create Your First Course
                        </Link>
                    </div>
                </div>
            )}

            {/* Courses Table */}
            {courses.length > 0 && <InstructorCourses courses={courses} />}
        </div>
    );
};

export default InstructorDashBoard;
