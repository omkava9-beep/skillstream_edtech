import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { buyCourse } from '../../services/operations/paymentAPI';
import { addToCart } from '../../redux/slices/cartReducer';
import { FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import { MdShoppingCart } from 'react-icons/md';

const BuyCourseButton = ({ course }) => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { cart } = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // Check if user is already enrolled
    const isEnrolled = course?.studentsEnrolled?.includes(user?._id);

    // Check if user is the instructor
    const isInstructor = course?.instructor?._id === user?._id;

    // Check if course is in cart
    const isInCart = cart.some((item) => item._id === course._id);

    const handleBuyCourse = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        setLoading(true);
        await buyCourse(course._id, token, user, navigate);
        setLoading(false);
    };

    const handleAddToCart = () => {
        if (!token) {
            navigate('/login');
            return;
        }
        dispatch(addToCart(course));
    };

    // If user is instructor, don't show buy button
    if (isInstructor) {
        return (
            <div className="bg-caribbeangreen-700 text-caribbeangreen-50 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 justify-center">
                <FiCheckCircle size={20} />
                You are the instructor
            </div>
        );
    }

    // If already enrolled, show enrolled status
    if (isEnrolled) {
        return (
            <button
                onClick={() => navigate('/dashboard/enrolled-courses')}
                className="bg-caribbeangreen-700 hover:bg-caribbeangreen-600 text-caribbeangreen-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2 justify-center w-full"
            >
                <FiCheckCircle size={20} />
                Go to Course
            </button>
        );
    }

    // Show buy and cart buttons
    return (
        <div className="space-y-3">
            <button
                onClick={handleBuyCourse}
                disabled={loading}
                className="bg-yellow-50 hover:bg-yellow-100 text-richblack-900 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 justify-center w-full"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-richblack-900"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <FiShoppingCart size={20} />
                        Buy Now - ₹{course?.price}
                    </>
                )}
            </button>

            {isInCart ? (
                <button
                    onClick={() => navigate('/dashboard/cart')}
                    className="bg-richblack-700 hover:bg-richblack-600 text-richblack-5 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 justify-center w-full border border-richblack-600"
                >
                    <MdShoppingCart size={20} />
                    Go to Cart
                </button>
            ) : (
                <button
                    onClick={handleAddToCart}
                    className="bg-richblack-800 hover:bg-richblack-700 text-richblack-5 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2 justify-center w-full border border-richblack-600"
                >
                    <MdShoppingCart size={20} />
                    Add to Cart
                </button>
            )}
        </div>
    );
};

export default BuyCourseButton;

