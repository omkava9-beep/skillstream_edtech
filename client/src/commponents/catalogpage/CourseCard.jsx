import React, { useEffect, useState } from 'react'
import RatingStars from '../../commponents/common/RatingStars'
import GetAvgRating from '../../utils/avgRating.js'
import { Link, useNavigate } from 'react-router-dom'
import { HiUsers } from 'react-icons/hi'
import { FiShoppingCart, FiArrowRight } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/slices/cartReducer'

const CourseCard = ({course, Height}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course?.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])

    const handleAddToCart = (e) => {
        e.preventDefault();
        if(!token) {
            navigate("/login");
            return;
        }
        dispatch(addToCart(course));
    }

    return (
        <div className="group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.01]">
            {/* 1. SUBTLE BORDER GRADIENT */}
            <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5 opacity-100" />

            {/* 2. THE MAIN GLASSY CARD */}
            <div className="relative flex flex-col gap-4 rounded-2xl p-4 h-full
                            bg-white/[0.02] backdrop-blur-xl border border-white/5
                            shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]
                            overflow-hidden">
                
                {/* 3. LIGHTER GRADIENT BALLS (Reduced Opacity & Size) */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-yellow-100/10 blur-[40px] rounded-full group-hover:bg-yellow-100/20 transition-all duration-700" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full group-hover:bg-blue-500/10 transition-all duration-700" />

                {/* 4. THUMBNAIL CONTAINER */}
                <div className="relative rounded-xl overflow-hidden z-10 shadow-lg">
                    <img
                        src={course?.thumbnail}
                        alt="course thumbnail"
                        className={`${Height || 'h-full'} w-full object-cover transition-transform duration-700 group-hover:scale-105`}
                    />

                    {/* Quick Action Button */}
                    <button 
                        onClick={handleAddToCart}
                        className="absolute bottom-3 right-3 p-2.5 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-xl
                                   translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                                   transition-all duration-500 hover:bg-yellow-100 hover:text-richblack-900"
                    >
                        <FiShoppingCart size={18} />
                    </button>
                </div>

                {/* 5. CONTENT AREA */}
                <div className="flex flex-col gap-2.5 flex-grow z-10 px-0.5">
                    {/* Category Tag */}
                    <div className="flex">
                         <span className="text-[9px] font-bold text-yellow-100/60 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                            {course?.category?.name || "Development"}
                         </span>
                    </div>

                    <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">
                        {course?.courseName}
                    </h3>
                    
                    <p className="text-xs text-richblack-400 font-medium">
                        By <span className="text-richblack-100">{course?.instructor?.firstName} {course?.instructor?.lastName}</span>
                    </p>

                    {/* Stats & Rating */}
                    <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-richblack-200 text-[11px]">
                            <HiUsers className="text-yellow-100/80" />
                            <span>{course?.studentsEnrolled?.length || 0}</span>
                        </div>
                        <div className="h-3 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            <span className="text-yellow-100/90 font-bold text-xs">{avgReviewCount || 0}</span>
                            <RatingStars Review_Count={avgReviewCount} Star_Size={12} />
                        </div>
                    </div>

                    {/* 6. PRICE & ACTION FOOTER */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-richblack-500 font-bold uppercase tracking-wider">Price</span>
                            <p className="text-xl font-bold text-white">
                                ₹{course?.price?.toLocaleString('en-IN')}
                            </p>
                        </div>

                        <Link 
                            to={`/courses/${course._id}`}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 
                                       text-white transition-all duration-300 hover:w-28 hover:bg-yellow-100 hover:text-black group/btn overflow-hidden"
                        >
                            <span className="hidden group-hover/btn:block text-xs font-bold whitespace-nowrap mr-2 pl-3">Explore</span>
                            <FiArrowRight size={18} className="shrink-0" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseCard