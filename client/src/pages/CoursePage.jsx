import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {apiConnector} from '../../services/apiConnector'
import { courseEndpoints } from '../../services/apis';
import RatingStars from '../commponents/common/RatingStars';
import GetAvgRating from '../utils/avgRating';
import Loader from '../commponents/common/Loader';
import BuyCourseButton from '../commponents/course/BuyCourseButton';
import { IoSwapVertical, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { AiFillGold } from 'react-icons/ai';
import { FiCheck, FiClock, FiUsers, FiBarChart, FiDownload, FiShare2, FiHome, FiChevronRight } from 'react-icons/fi';
import { MdOutlineOndemandVideo } from 'react-icons/md';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ReviewCard from '../commponents/core/Homepage/ReviewCard';

const CoursePage = () => {
    console.log("!!! COURSE PAGE V3 - PAYMENT GATEWAY FIXED !!!");
    const location = useLocation();
    const navigate = useNavigate();
    const {courseid} = useParams();
    const courseId = courseid;
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSections, setActiveSections] = useState([]);

    const toggleSection = (id) => {
        setActiveSections((prev) => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };
    
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
        <div className="relative w-full bg-linear-to-br from-richblack-900 via-richblack-900 to-richblack-800 text-richblack-5 min-h-screen pt-16">
            {/* Hero Section with Gradient Background */}
            <div className="relative overflow-hidden">
                {/* Animated background elements */}
                <div className='absolute bottom-0 left-100 w-96 h-96 bg-yellow-200 rounded-full mix-blend-screen filter blur-3xl opacity-10'></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-linear-to-br from-yellow-200/5 via-blue-500/5 to-transparent blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
                
                <div className="relative z-10 py-8 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-richblack-300 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
                        <div 
                            className="flex items-center gap-1 hover:text-yellow-100 cursor-pointer transition-colors"
                            onClick={() => navigate('/')}
                        >
                            <FiHome />
                            <span>Home</span>
                        </div>
                        <FiChevronRight className="shrink-0" />
                        <div 
                            className="flex items-center gap-1 hover:text-yellow-100 cursor-pointer transition-colors"
                            onClick={() => navigate('/catalog/all-courses')}
                        >
                            <span>Catalog</span>
                        </div>
                        <FiChevronRight className="shrink-0" />
                        <span className="text-yellow-100 font-medium truncate">
                            {courseData?.courseName}
                        </span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Badge and Category */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-1 bg-yellow-100/15 text-yellow-100 rounded-full text-[10px] sm:text-xs font-bold border border-yellow-100/30 uppercase tracking-wider">
                                    Premium Course
                                </span>
                                <span className="px-3 py-1 bg-blue-500/15 text-blue-200 rounded-full text-[10px] sm:text-xs font-bold border border-blue-500/30 uppercase tracking-wider">
                                    {courseData?.catagory?.name || 'Category'}
                                </span>
                            </div>

                            {/* Title with gradient */}
                            <div>
                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-yellow-100 to-yellow-300 bg-clip-text text-transparent mb-4 leading-tight">
                                    {courseData?.courseName}
                                </h1>
                                <p className="text-base md:text-lg text-richblack-300 leading-relaxed max-w-3xl">
                                    {courseData?.courseDescription}
                                </p>
                            </div>

                            {/* Rating and Stats */}
                            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-richblack-700/50">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <RatingStars Review_Count={avgReview} Star_Size={20}/>
                                        <span className="text-xl font-bold text-yellow-100 ml-1">{avgReview}</span>
                                    </div>
                                    <span className="text-sm text-richblack-400">({courseData?.ratingAndReviews?.length} Reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-richblack-300">
                                    <div className="p-2 bg-richblack-700/50 rounded-lg">
                                        <FiUsers className="text-yellow-100 text-lg"/>
                                    </div>
                                    <span className="font-medium text-richblack-100">{courseData?.studentsEnrolled?.length.toLocaleString()} Students Enrolled</span>
                                </div>
                            </div>

                            {/* Instructor Card */}
                            <div className="inline-flex items-center gap-4 p-4 bg-richblack-800/40 rounded-2xl border border-richblack-700/50 backdrop-blur-sm shadow-xl">
                                <div className="w-14 h-14 rounded-full p-0.5 bg-linear-to-br from-yellow-100 to-richblack-900">
                                    <div className="w-full h-full rounded-full bg-richblack-900 flex items-center justify-center text-yellow-100 text-xl font-black">
                                        {courseData?.instructor?.firstName?.charAt(0)}{courseData?.instructor?.lastName?.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-richblack-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Expert Mentor</p>
                                    <p className="text-lg font-bold text-white leading-none">
                                        {courseData?.instructor?.firstName} {courseData?.instructor?.lastName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Sticky Card */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            <div className="relative group">
                                {/* Decorative Blur Effect */}
                                <div className="absolute -inset-1 bg-linear-to-r from-yellow-100/30 to-blue-500/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                
                                <div className="relative bg-richblack-900 border border-richblack-700/50 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                                    {/* Thumbnail */}
                                    {courseData?.thumbnail && (
                                        <div className="relative mb-6 group/img overflow-hidden rounded-xl border border-richblack-700 shadow-inner">
                                            <img 
                                                src={courseData?.thumbnail} 
                                                alt={courseData?.courseName}
                                                className="w-full h-48 object-cover group-hover/img:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                    <MdOutlineOndemandVideo className="text-2xl text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="mb-6">
                                        <p className="text-richblack-400 text-xs font-black uppercase tracking-widest mb-1">Lifetime Excellence for</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-4xl font-black text-white">
                                                ₹{courseData?.price}
                                            </p>
                                            <div className="px-2 py-0.5 bg-yellow-100/10 rounded border border-yellow-100/20 text-[10px] font-bold text-yellow-100 uppercase">
                                                Best Price
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buy Course Button Component */}
                                    <BuyCourseButton course={courseData} />

                                    {/* Benefits List */}
                                    <div className="space-y-4 pt-8 mt-6 border-t border-richblack-800">
                                        <p className="text-xs font-bold text-richblack-200 uppercase tracking-widest">Everything Included:</p>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center gap-3 group/feat">
                                                <div className="w-10 h-10 rounded-xl bg-richblack-800 flex items-center justify-center group-hover/feat:bg-yellow-100/10 transition-colors">
                                                    <IoSwapVertical className="text-richblack-400 group-hover/feat:text-yellow-100 text-lg transition-colors"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-richblack-5">{courseData?.courseContent?.length} Modules</p>
                                                    <p className="text-[10px] text-richblack-500 uppercase font-black">Full Curriculum</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 group/feat">
                                                <div className="w-10 h-10 rounded-xl bg-richblack-800 flex items-center justify-center group-hover/feat:bg-yellow-100/10 transition-colors">
                                                    <AiFillGold className="text-richblack-400 group-hover/feat:text-yellow-100 text-lg transition-colors"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-richblack-5">Certificate</p>
                                                    <p className="text-[10px] text-richblack-500 uppercase font-black">Official Accreditation</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 group/feat cursor-pointer" onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert("Link copied to clipboard!");
                                            }}>
                                                <div className="w-10 h-10 rounded-xl bg-richblack-800 flex items-center justify-center group-hover/feat:bg-blue-500/10 transition-colors">
                                                    <FiShare2 className="text-richblack-400 group-hover/feat:text-blue-200 text-lg transition-colors"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-richblack-5">Share Course</p>
                                                    <p className="text-[10px] text-richblack-500 uppercase font-black">Spread the Word</p>
                                                </div>
                                            </div>
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
                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
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
                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
                <h2 className="text-2xl font-bold mb-6">📚 Course Curriculum</h2>
                <div className="space-y-4">
                    {courseData?.courseContent?.map((section, index) => (
                        <div key={section._id} className="bg-richblack-800/60 rounded-2xl border border-richblack-700 overflow-hidden transition-all duration-300 hover:border-yellow-100/20">
                            <div 
                                className="flex items-center justify-between p-5 cursor-pointer bg-richblack-800 hover:bg-richblack-700/50 transition-all duration-300"
                                onClick={() => toggleSection(section._id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100/10 flex items-center justify-center text-yellow-100 font-bold shadow-inner">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-base md:text-lg font-bold text-richblack-5">{section.sectionName}</h4>
                                        <p className="text-richblack-400 text-xs flex items-center gap-1 mt-1">
                                            <MdOutlineOndemandVideo />
                                            {section.subSection?.length} Lectures
                                        </p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-richblack-700 flex items-center justify-center text-yellow-100 transition-transform duration-300">
                                    {activeSections.includes(section._id) ? <IoChevronUp /> : <IoChevronDown />}
                                </div>
                            </div>
                            
                            {/* Sub-sections Container */}
                            <div className={`transition-all duration-500 ease-in-out ${activeSections.includes(section._id) ? 'max-h-[1000px] border-t border-richblack-700 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                <div className="p-4 space-y-2 bg-richblack-900/30">
                                    {section.subSection?.map((subsection, idx) => (
                                        <div key={subsection._id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-richblack-700/30 transition-all duration-200 group/sub">
                                            <div className="w-8 h-8 rounded-full border border-richblack-600 flex items-center justify-center text-richblack-400 text-xs font-bold group-hover/sub:border-yellow-100/50 group-hover/sub:text-yellow-100 transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-richblack-50 group-hover/sub:text-yellow-50 transition-colors">{subsection.title}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="flex items-center gap-1.5 text-richblack-400 text-[10px] uppercase font-bold tracking-widest">
                                                        <FiClock className="text-yellow-100 text-xs"/>
                                                        {subsection.timeDuration ? `${subsection.timeDuration} Min` : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-richblack-700 rounded-lg group-hover/sub:bg-yellow-100/10 transition-colors">
                                                <MdOutlineOndemandVideo className="text-richblack-400 group-hover/sub:text-yellow-100 transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>

            {/* Skills Section */}
            {courseData?.tag?.length > 0 && (
                <div className="py-16 bg-richblack-800/40 border-y border-richblack-700/50">
                    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center italic">
                        <span className="text-yellow-100">🎯 Skills</span> You'll Master
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {courseData?.tag?.map((tag, index) => (
                            <div 
                                key={index} 
                                className="group px-6 py-3 bg-richblack-900/60 border border-richblack-700 rounded-full hover:border-yellow-100/50 hover:bg-yellow-100/5 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <FiBarChart className="text-yellow-100 text-lg group-hover:scale-110 transition-transform"/>
                                    <span className="font-bold text-sm text-richblack-100 group-hover:text-yellow-100 transition">{tag}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            {courseData?.ratingAndReviews?.length > 0 && (
                <div className="py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
                        <div className="flex flex-col items-center mb-10 text-center">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 italic">Student Experiences</h2>
                            <p className="text-richblack-400 text-sm italic">Join {courseData?.studentsEnrolled?.length.toLocaleString()}+ students already learning this course</p>
                        </div>

                        <div className="w-full">
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={25}
                                loop={true}
                                freeMode={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                navigation={true}
                                modules={[FreeMode, Pagination, Autoplay, Navigation]}
                                breakpoints={{
                                    640: { slidesPerView: 1.5 },
                                    1024: { slidesPerView: 2.5 },
                                    1280: { slidesPerView: 3 },
                                }}
                                className="w-full pb-12"
                            >
                                {courseData?.ratingAndReviews?.map((review) => (
                                    <SwiperSlide key={review._id}>
                                        <ReviewCard
                                            name={`${review.user?.firstName || 'User'} ${review.user?.lastName || ''}`}
                                            email={review.user?.email}
                                            avatar={review.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review.user?.firstName}`}
                                            review={review.review}
                                            rating={review.rating}
                                            courseName={courseData?.courseName}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <div className="py-20 bg-linear-to-b from-transparent to-richblack-900">
                <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-20">
                    <div className="relative group overflow-hidden rounded-4xl border border-richblack-700/50 bg-richblack-800 p-1">
                        <div className="absolute -inset-1 bg-linear-to-r from-yellow-100 to-blue-500 opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative flex flex-col items-center text-center py-16 px-8 rounded-[1.95rem] bg-richblack-900">
                            <span className="mb-6 px-4 py-1.5 bg-yellow-100/10 text-yellow-100 border border-yellow-100/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Limitless Opportunity</span>
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Transform Your Career with <br/> 
                                <span className="text-yellow-100 italic">Industry-Standard</span> Excellence
                            </h3>
                            <p className="text-richblack-400 text-lg mb-10 max-w-2xl leading-relaxed">
                                Join our thriving community of students masterfully building their futures today. 
                                Secure your spot in this course and start learning immediately.
                            </p>
                            <div className="w-full max-w-sm">
                                <BuyCourseButton course={courseData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="py-10 border-t border-richblack-700/50">
                <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
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