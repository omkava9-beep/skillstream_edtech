import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {apiConnector} from '../../services/apiConnector'
import { courseEndpoints } from '../../services/apis';
import RatingStars from '../commponents/common/RatingStars';
import GetAvgRating from '../utils/avgRating';
import Loader from '../commponents/common/Loader';
import BuyCourseButton from '../commponents/course/BuyCourseButton';
import { IoSwapVertical } from 'react-icons/io5';
import { AiFillGold } from 'react-icons/ai';
import { FiCheck, FiClock, FiUsers, FiBarChart, FiDownload, FiShare2 } from 'react-icons/fi';
import { MdOutlineOndemandVideo } from 'react-icons/md';

const CoursePage = () => {
    console.log("!!! COURSE PAGE V3 - PAYMENT GATEWAY FIXED !!!");
    const location = useLocation();
    const navigate = useNavigate();
    const courseId = location.pathname.split('/').pop();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        const fetchCourseDetails = async()=>{
            try{
                setLoading(true);
                const response = await apiConnector('GET',`${courseEndpoints.GET_COURSE}/${courseId}`);
                setCourseData(response.data.data);
            }catch(e){
                console.log('Error while fetching coursepage data',e);
            }finally{
                setLoading(false);
            }
        }
        fetchCourseDetails();
    },[courseId])

    if(loading){
        return <Loader/>
    }

    if(!courseData){
        return <div className="text-center py-20">Course not found</div>
    }

    const avgReview = GetAvgRating(courseData?.ratingAndReviews);

    return (
        <div className="bg-gradient-to-br from-richblack-900 via-richblack-900 to-richblack-800 pt-10 text-richblack-5 min-h-screen">
            {/* Hero Section with Gradient Background */}
            <div className="relative overflow-hidden">
                {/* Animated background elements */}
                <div className='absolute bottom-0 left-100 w-96 h-96 bg-yellow-200 rounded-full mix-blend-screen filter blur-3xl opacity-10'></div>
                <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-200 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
                
                <div className="relative z-10 py-8 max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Badge and Category */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-1 bg-yellow-100/15 text-yellow-100 rounded-full text-xs font-semibold border border-yellow-100/30">
                                    Featured Course
                                </span>
                                <span className="px-3 py-1 bg-blue-500/15 text-blue-200 rounded-full text-xs font-semibold border border-blue-500/30">
                                    {courseData?.catagory?.name || 'Category'}
                                </span>
                            </div>

                            {/* Title with gradient */}
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-100 to-yellow-300 bg-clip-text text-transparent mb-3 leading-tight">
                                    {courseData?.courseName}
                                </h1>
                                <p className="text-base text-richblack-300 leading-relaxed">
                                    {courseData?.courseDescription}
                                </p>
                            </div>

                            {/* Rating and Stats */}
                            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-richblack-700">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <RatingStars Review_Count={avgReview} Star_Size={18}/>
                                        <span className="text-lg font-bold text-yellow-100">{avgReview}</span>
                                    </div>
                                    <span className="text-sm text-richblack-400">({courseData?.ratingAndReviews?.length} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-richblack-300">
                                    <FiUsers className="text-yellow-100 text-lg"/>
                                    <span>{courseData?.studentsEnrolled?.length.toLocaleString()} students</span>
                                </div>
                            </div>

                            {/* Instructor Card */}
                            <div className="group bg-gradient-to-r from-richblack-800 to-richblack-700 p-4 rounded-lg border border-richblack-700 hover:border-yellow-100/30 transition-all duration-300 cursor-pointer">
                                <p className="text-richblack-400 text-xs font-semibold mb-2">Created by</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center text-richblack-900 text-lg font-bold">
                                        {courseData?.instructor?.firstName?.charAt(0)}{courseData?.instructor?.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold group-hover:text-yellow-100 transition">
                                            {courseData?.instructor?.firstName} {courseData?.instructor?.lastName}
                                        </p>
                                        <p className="text-richblack-400 text-xs">Expert Instructor</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sticky Card */}
                        <div className="lg:sticky lg:top-20 h-fit">
                            <div className="bg-transparent bg-gradient-to-br from-richblack-900 to-richblack-800 rounded-xl p-6 border border-yellow-100/20 shadow-lg">
                                {/* Thumbnail */}
                                {courseData?.thumbnail && (
                                    <div className="relative mb-6 group overflow-hidden rounded-lg">
                                        <img 
                                            src={courseData?.thumbnail} 
                                            alt={courseData?.courseName}
                                            className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-richblack-900 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
                                            <MdOutlineOndemandVideo className="text-3xl text-yellow-100" />
                                        </div>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="mb-4">
                                    <p className="text-richblack-400 text-xs mb-1">Price</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-bold bg-gradient-to-r from-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                                            ₹{courseData?.price}
                                        </p>
                                    </div>
                                </div>

                                {/* Buy Course Button */}
                                <BuyCourseButton course={courseData} />


                                {/* Share Button */}
                                <button className="w-full flex items-center justify-center gap-2 bg-richblack-700 hover:bg-richblack-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 mb-4 border border-richblack-600 text-sm">
                                    <FiShare2 className="text-base"/>
                                    Share Course
                                </button>

                                {/* Key Features */}
                                <div className="space-y-3 pt-4 border-t border-richblack-700">
                                    <div className="flex items-center gap-3 hover:translate-x-1 transition">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100/20 flex items-center justify-center flex-shrink-0">
                                            <IoSwapVertical className="text-yellow-100 text-sm"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-richblack-400">Sections</p>
                                            <p className="font-semibold text-richblack-5 text-sm">{courseData?.courseContent?.length}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 hover:translate-x-1 transition">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100/20 flex items-center justify-center flex-shrink-0">
                                            <AiFillGold className="text-yellow-100 text-sm"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-richblack-400">Certificate</p>
                                            <p className="font-semibold text-richblack-5 text-sm">Included</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 hover:translate-x-1 transition">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100/20 flex items-center justify-center flex-shrink-0">
                                            <FiDownload className="text-yellow-100 text-sm"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-richblack-400">Resources</p>
                                            <p className="font-semibold text-richblack-5 text-sm">Downloadable</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What You'll Learn Section */}
            <div className="py-10 bg-richblack-800/50">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseData?.whatYouWillLearn?.split('\n').filter(point => point.trim()).map((point, index) => (
                        <div key={index} className="flex items-start gap-3 group p-4 bg-richblack-900/50 rounded-lg hover:bg-richblack-800/50 transition-all duration-300">
                            <FiCheck className="text-xl text-yellow-100 shrink-0 mt-1 group-hover:scale-110 transition-transform"/>
                            <p className="text-richblack-300 text-sm leading-relaxed">{point}</p>
                        </div>
                    ))}
                </div>
                </div>
            </div>

            {/* Course Content Section */}
            <div className="py-10">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <h2 className="text-2xl font-bold mb-6">📚 Course Curriculum</h2>
                <div className="space-y-4">
                    {courseData?.courseContent?.map((section, index) => (
                        <details key={section._id} className="group bg-gradient-to-r from-richblack-800 to-richblack-700 rounded-lg border border-richblack-700 hover:border-yellow-100/30 transition-all duration-300 overflow-hidden">
                            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-richblack-700/50 transition">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-yellow-100 bg-yellow-100/20 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h4 className="text-base font-bold">{section.sectionName}</h4>
                                        <p className="text-richblack-400 text-xs">{section.subSection?.length} lessons</p>
                                    </div>
                                </div>
                                <span className="text-lg text-yellow-100 group-open:rotate-180 transition-transform duration-300">▼</span>
                            </summary>
                            
                            {/* Sub-sections */}
                            <div className="bg-richblack-900/50 border-t border-richblack-700 px-4 py-3 space-y-2">
                                {section.subSection?.map((subsection, idx) => (
                                    <div key={subsection._id} className="flex items-start gap-3 p-3 bg-richblack-800/50 rounded hover:bg-richblack-800 transition group/sub">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100/20 text-yellow-100 font-semibold text-xs shrink-0 group-hover/sub:bg-yellow-100/40 transition">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm group-hover/sub:text-yellow-100 transition">{subsection.title}</p>
                                            <div className="flex items-center gap-2 mt-1 text-richblack-400 text-xs">
                                                <FiClock className="text-yellow-100"/>
                                                <span>{subsection.timeDuration ? `${subsection.timeDuration} min` : 'N/A'}</span>
                                            </div>
                                        </div>
                                        <MdOutlineOndemandVideo className="text-sm text-yellow-100 shrink-0 group-hover/sub:scale-110 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
                </div>
            </div>

            {/* Skills Section */}
            {courseData?.tag?.length > 0 && (
                <div className="py-10 bg-richblack-800/50">
                    <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-bold mb-6">🎯 Skills You'll Master</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {courseData?.tag?.map((tag, index) => (
                            <div 
                                key={index} 
                                className="group p-3 bg-gradient-to-r from-yellow-100/10 to-yellow-300/5 border border-yellow-100/30 rounded-lg hover:border-yellow-100/60 hover:bg-yellow-100/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
                            >
                                <div className="flex items-center gap-2">
                                    <FiBarChart className="text-yellow-100 text-lg group-hover:scale-110 transition-transform"/>
                                    <span className="font-semibold text-sm group-hover:text-yellow-100 transition">{tag}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            {courseData?.ratingAndReviews?.length > 0 && (
                <div className="py-10">
                    <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">⭐ Student Reviews</h2>
                        <span className="text-richblack-400 text-sm">({courseData?.ratingAndReviews?.length} total)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courseData?.ratingAndReviews?.slice(0, 6).map((review) => (
                            <div 
                                key={review._id} 
                                className="group bg-gradient-to-br from-richblack-800 to-richblack-700 rounded-lg p-4 border border-richblack-700 hover:border-yellow-100/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center text-richblack-900 font-bold text-sm group-hover:scale-110 transition-transform">
                                            {review.user?.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{review.user?.firstName} {review.user?.lastName}</p>
                                            <RatingStars Review_Count={review.rating} Star_Size={14}/>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-richblack-300 text-xs leading-relaxed italic">"{review.review}"</p>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <div className="py-10">
                <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="bg-gradient-to-r from-yellow-100/20 to-blue-500/20 rounded-lg p-8 border border-yellow-100/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
                <div className="relative z-10 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Transform Your Skills?</h3>
                    <p className="text-richblack-300 mb-6 text-sm">Join thousands of students already learning with us</p>
                    <div className="flex justify-center">
                        <div className="w-full max-w-xs">
                            <BuyCourseButton course={courseData} />
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="py-10 border-t border-richblack-700/50">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="group hover:scale-105 transition">
                        <p className="text-yellow-100 text-xl font-bold">{courseData?.courseContent?.length}</p>
                        <p className="text-richblack-400 text-xs">Sections</p>
                    </div>
                    <div className="group hover:scale-105 transition">
                        <p className="text-yellow-100 text-xl font-bold">{courseData?.studentsEnrolled?.length}</p>
                        <p className="text-richblack-400 text-xs">Students</p>
                    </div>
                    <div className="group hover:scale-105 transition">
                        <p className="text-yellow-100 text-xl font-bold">{avgReview}</p>
                        <p className="text-richblack-400 text-xs">Rating</p>
                    </div>
                    <div className="group hover:scale-105 transition">
                        <p className="text-yellow-100 text-xl font-bold">∞</p>
                        <p className="text-richblack-400 text-xs">Lifetime Access</p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default CoursePage