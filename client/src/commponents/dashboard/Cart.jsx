import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, resetCart } from '../../redux/slices/cartReducer';
import { buyMultipleCourses } from '../../services/operations/paymentAPI';
import { MdDelete } from 'react-icons/md';
import { FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cart, total, totalItems } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (courseId) => {
    dispatch(removeFromCart(courseId));
  };

  const handleCheckoutAll = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Extract course IDs from cart
    const courseIds = cart.map(course => course._id);

    // Use the new multi-course payment function
    const success = await buyMultipleCourses(courseIds, token, user, navigate);

    if (success) {
      // Clear cart after successful payment initiation
      // The actual enrollment happens after Razorpay payment verification
      dispatch(resetCart());
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-richblack-900 py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-3xl font-bold text-richblack-5 mb-8">Shopping Cart</h1>
          
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 rounded-full bg-richblack-800 flex items-center justify-center mb-6">
              <FiShoppingCart className="text-6xl text-richblack-400" />
            </div>
            <h2 className="text-2xl font-semibold text-richblack-5 mb-3">Your cart is empty</h2>
            <p className="text-richblack-300 mb-6">Add courses to get started</p>
            <button
              onClick={() => navigate('/catalog/all')}
              className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all"
            >
              Browse Courses
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-900 py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-bold text-richblack-5 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-richblack-300 mb-4">{totalItems} {totalItems === 1 ? 'Course' : 'Courses'} in Cart</p>
            
            {cart.map((course) => (
              <div
                key={course._id}
                className="bg-richblack-800 rounded-lg p-4 border border-richblack-700 hover:border-richblack-600 transition-all"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  {/* Course Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-richblack-5 mb-2">
                      {course.courseName}
                    </h3>
                    <p className="text-sm text-richblack-300 mb-2">
                      By {course.instructor?.firstName} {course.instructor?.lastName}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-yellow-100 font-bold text-xl">
                        ₹{course.price}
                      </p>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(course._id)}
                    className="text-pink-200 hover:text-pink-100 transition-colors self-start"
                    title="Remove from cart"
                  >
                    <MdDelete size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700 sticky top-20">
              <h2 className="text-xl font-semibold text-richblack-5 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-richblack-300">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>₹{total}</span>
                </div>
                <div className="border-t border-richblack-700 pt-3">
                  <div className="flex justify-between text-richblack-5 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-yellow-100">₹{total}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckoutAll}
                className="w-full bg-yellow-50 hover:bg-yellow-100 text-richblack-900 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 mb-4"
              >
                Checkout All
                <FiArrowRight />
              </button>

              <button
                onClick={() => navigate('/catalog/all')}
                className="w-full bg-richblack-700 hover:bg-richblack-600 text-richblack-5 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
