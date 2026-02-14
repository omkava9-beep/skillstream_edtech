import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../../services/apiConnector';
import { paymentEndpoints } from '../../../services/apis';
import Loader from '../common/Loader';
import { FiClock, FiCheckCircle, FiCreditCard } from 'react-icons/fi';

const PurchaseHistory = () => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                setLoading(true);
                const response = await apiConnector(
                    "GET",
                    paymentEndpoints.GET_PAYMENT_HISTORY_API,
                    null,
                    { Authorization: `Bearer ${token}` }
                );
                if (response.data.success) {
                    setPayments(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching purchase history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPurchaseHistory();
    }, [token]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="text-white p-3 sm:p-6 max-w-4xl mx-auto no-scrollbar">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                <div className="p-3 bg-yellow-100/10 rounded-xl w-fit">
                    <FiCreditCard className="text-xl sm:text-2xl text-yellow-100" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-richblack-5 to-richblack-200 bg-clip-text text-transparent">
                        Purchase History
                    </h1>
                    <p className="text-sm sm:text-base text-richblack-400">View all your course transactions</p>
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-10 md:p-20 text-center">
                    <p className="text-richblack-400 text-base sm:text-lg">You haven't purchased any courses yet.</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:gap-6">
                    {payments.map((payment) => (
                        <div 
                            key={payment._id}
                            className="group bg-linear-to-br from-richblack-800 to-richblack-700 p-3 sm:p-6 rounded-2xl border border-richblack-700 hover:border-yellow-100/30 transition-all duration-300"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                                {/* Left Side: Image & Info */}
                                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                                    <img 
                                        src={payment.courseId?.thumbnail} 
                                        alt={payment.courseId?.courseName}
                                        className="w-12 h-12 sm:w-20 sm:h-20 object-cover rounded-lg border border-richblack-600 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-xl font-bold text-richblack-5 group-hover:text-yellow-100 transition line-clamp-2">
                                            {payment.courseId?.courseName}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-[10px] sm:text-sm text-richblack-300">
                                            <div className="flex items-center gap-1">
                                                <FiClock className="text-yellow-100 shrink-0" />
                                                <span>{new Date(payment.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FiCheckCircle className="text-caribbeangreen-200 shrink-0" />
                                                <span className="text-caribbeangreen-200 font-medium">Successful</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Side: Amount & ID */}
                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t border-richblack-700 lg:border-t-0 pt-3 lg:pt-0 gap-2">
                                    <p className="text-lg sm:text-2xl font-black text-yellow-100 font-inter">₹{payment.amount}</p>
                                    <div className="flex flex-col items-end">
                                      <p className="hidden lg:block text-[9px] text-richblack-500 font-mono uppercase tracking-wider">Transaction ID</p>
                                      <p className="text-[9px] sm:text-xs text-richblack-400 font-mono bg-richblack-900/50 px-2 py-1 rounded-sm border border-richblack-700/50">
                                        <span className="lg:hidden pr-1">ID:</span>
                                        {payment.paymentId?.substring(0, 12)}...
                                      </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
