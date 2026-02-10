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
        <div className="text-white p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-yellow-100/10 rounded-xl">
                    <FiCreditCard className="text-2xl text-yellow-100" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-richblack-5 to-richblack-200 bg-clip-text text-transparent">
                        Purchase History
                    </h1>
                    <p className="text-richblack-400">View all your course transactions</p>
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-20 text-center">
                    <p className="text-richblack-400 text-lg">You haven't purchased any courses yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {payments.map((payment) => (
                        <div 
                            key={payment._id}
                            className="group bg-gradient-to-br from-richblack-800 to-richblack-700 p-5 rounded-2xl border border-richblack-700 hover:border-yellow-100/30 transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={payment.courseId?.thumbnail} 
                                        alt={payment.courseId?.courseName}
                                        className="w-20 h-20 object-cover rounded-lg border border-richblack-600"
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-richblack-5 group-hover:text-yellow-100 transition">
                                            {payment.courseId?.courseName}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-richblack-300">
                                            <div className="flex items-center gap-1">
                                                <FiClock className="text-yellow-100" />
                                                <span>{new Date(payment.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FiCheckCircle className="text-caribbeangreen-200" />
                                                <span className="text-caribbeangreen-200">Successful</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-2xl font-bold text-yellow-100">₹{payment.amount}</p>
                                    <p className="text-xs text-richblack-500 font-mono mt-1">ID: {payment.paymentId}</p>
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
