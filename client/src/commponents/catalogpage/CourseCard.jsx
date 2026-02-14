import React, { useEffect, useState } from 'react'
import RatingStars from '../../commponents/common/RatingStars'
import GetAvgRating from '../../utils/avgRating.js'
import { Link, useNavigate } from 'react-router-dom'
import { HiUsers } from 'react-icons/hi'
import { FiShoppingCart } from 'react-icons/fi'
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
        e.preventDefault(); // Prevent navigating to course detail
        if(!token) {
            navigate("/login");
            return;
        }
        dispatch(addToCart(course));
    }

    // Logistic for bestseller badge
    const isBestseller = course?.studentsEnrolled?.length > 5;
    
  return (
    <div className="group relative">
      <Link to={`/courses/${course._id}`}>
        <div className="flex flex-col gap-4 rounded-2xl p-4 transition-all duration-300
                        bg-richblack-800/40 backdrop-blur-md border border-richblack-700/50
                        hover:bg-richblack-800/60 hover:border-richblack-600 hover:shadow-[0_0_20px_rgba(255,214,10,0.1)]
                        hover:-translate-y-1 w-full min-h-[420px]">  
          
          {/* Thumbnail Container */}
          <div className="relative rounded-xl overflow-hidden aspect-video">
            <img
              src={course?.thumbnail}
              alt="course thumbnail"
              className={`${Height || 'h-full'} w-full object-cover transition-transform duration-500 group-hover:scale-110`}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-richblack-900 via-richblack-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Bestseller Badge */}
            {isBestseller && (
                <div className="absolute top-3 left-3 bg-yellow-100 text-richblack-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <span className="w-2 h-2 bg-richblack-900 rounded-full animate-pulse"></span>
                    BESTSELLER
                </div>
            )}

            {/* Quick Add to Cart - Visible on Hover */}
            <button 
                onClick={handleAddToCart}
                className="absolute bottom-3 right-3 p-3 bg-yellow-100 text-richblack-900 rounded-xl shadow-xl 
                           translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                           transition-all duration-300 hover:scale-110 active:scale-95 z-20"
                title="Add to Cart"
            >
                <FiShoppingCart size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-richblack-5 line-clamp-2 leading-snug group-hover:text-yellow-50 transition-colors">
                    {course?.courseName}
                </h3>
                <p className="text-sm text-richblack-300 font-medium">
                    By <span className="text-richblack-100">{course?.instructor?.firstName} {course?.instructor?.lastName}</span>
                </p>
            </div>

            {/* Rating & Stats */}
            <div className="flex flex-col gap-2 mt-auto">
                <div className="flex items-center gap-2">
                    <span className="text-yellow-100 font-bold text-lg">{avgReviewCount || 0}</span>
                    <RatingStars Review_Count={avgReviewCount} Star_Size={18} />
                    <span className="text-richblack-400 text-sm">
                        ({course?.ratingAndReviews?.length || 0} Reviews)
                    </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="grow flex items-center gap-1.5 text-richblack-200 text-sm bg-richblack-700/50 px-3 py-1 rounded-lg">
                        <HiUsers className="text-yellow-100" />
                        <span>{course?.studentsEnrolled?.length || 0} Students</span>
                    </div>
                </div>
            </div>

            {/* Price section */}
            <div className="flex items-center justify-between border-t border-richblack-700/50 pt-4 mt-1">
                <p className="text-2xl font-black text-richblack-5">
                    ₹{course?.price?.toLocaleString('en-IN')}
                </p>
                <div className="text-xs text-yellow-100 font-bold tracking-widest uppercase">
                    Course
                </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CourseCard
