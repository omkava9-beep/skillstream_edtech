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

    if (loading) return <Loader />;

    const totalStudents = instructorData?.totalStudents || 0;
    const totalCourses = instructorData?.totalCourses || 0;
    const totalRevenue = instructorData?.totalRevenue || 0;
    const courses = instructorData?.courses || [];

    return (
        /* FIX: Added 'pt-16' on mobile (lg:pt-0) 
           This creates an empty space at the top so the 'Menu' button 
           doesn't sit on top of your 'Hi User' text.
        */
        <div className="space-y-6 pb-14 pt-16 lg:pt-0">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-richblack-800 to-richblack-900 border border-richblack-700 rounded-lg p-6 shadow-lg flex items-center justify-between">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-lg p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-md">
                            <BiBook className="text-blue-400 text-xl" />
                        </div>
                        <span className="text-blue-400 text-xs font-semibold uppercase">Courses</span>
                    </div>
                    <h3 className="text-3xl font-bold text-richblack-5 mb-1">{totalCourses}</h3>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-lg p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-md">
                            <HiUsers className="text-purple-400 text-xl" />
                        </div>
                        <span className="text-purple-400 text-xs font-semibold uppercase">Students</span>
                    </div>
                    <h3 className="text-3xl font-bold text-richblack-5 mb-1">{totalStudents}</h3>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-lg p-5 shadow-lg sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-500/20 rounded-md">
                            <BiRupee className="text-green-400 text-xl" />
                        </div>
                        <span className="text-green-400 text-xs font-semibold uppercase">Revenue</span>
                    </div>
                    <h3 className="text-3xl font-bold text-richblack-5 mb-1">
                        ₹{totalRevenue.toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Main Content (Charts & Table) */}
            {courses.length > 0 ? (
                <div className="flex flex-col gap-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-8">
                            <InstructorChart courses={courses} />
                        </div>
                        <div className="xl:col-span-4 bg-richblack-800 border border-richblack-700 rounded-lg p-6">
                            <h2 className="text-lg font-bold text-richblack-5 mb-6">Quick Actions</h2>
                            <div className="flex flex-col gap-4">
                                <Link to="/dashboard/add-course" className="bg-yellow-50 text-richblack-900 p-3 rounded-lg text-center font-bold">Create Course</Link>
                                <Link to="/dashboard/my-courses" className="bg-richblack-700 text-richblack-5 p-3 rounded-lg text-center border border-richblack-600">Manage Courses</Link>
                            </div>
                        </div>
                    </div>
                    {/* Courses Table */}
                    <InstructorCourses courses={courses} />
                </div>
            ) : (
                <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-12 text-center">
                    <p className="text-richblack-300">No courses yet.</p>
                    <Link to="/dashboard/add-course" className="text-yellow-50 mt-4 block">Create your first course</Link>
                </div>
            )}
        </div>
    );
};

export default InstructorDashBoard;