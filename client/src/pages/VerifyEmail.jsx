import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiConnector';
import { auth } from '../../services/apis';
import Loader from '../commponents/common/Loader';
import { setLoading } from '../redux/slices/authReducer';

const VerifyEmail = () => {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { signupData, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        // If no signup data, user shouldn't be here
        if (!signupData) {
            navigate("/signup");
        }
    }, []);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        const {
            accountType,
            firstname,
            lastname,
            email,
            password,
            confirmpassword,
        } = signupData;

        try {
            const response = await apiConnector("POST", auth.SIGNUP_API, {
                accountType,
                firstName: firstname,
                lastName: lastname,
                email,
                password,
                confirmPassword: confirmpassword,
                otp,
            });

            console.log("SIGNUP API RESPONSE............", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Signup Successful! Please Login to Continue");
            navigate("/login");

        } catch (error) {
            console.log("SIGNUP API ERROR............", error);
            toast.error(error.response?.data?.message || "Signup Failed");
        }
        dispatch(setLoading(false));
    };

    return (
        <>
            {loading && <Loader />}
            <div className='min-h-[calc(100vh-4rem)] pt-16 grid place-items-center'>
                <div className='max-w-[500px] p-4 lg:p-8'>
                    <h1 className='text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]'>
                        Verify Email
                    </h1>
                    <p className='text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100'>
                        A verification code has been sent to you. Enter the code below
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    placeholder="-"
                                    style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                                />
                            )}
                            containerStyle={{
                                justifyContent: "space-between",
                                gap: "0 6px",
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900 disabled:opacity-50"
                        >
                            Verify Email
                        </button>
                    </form>

                    <div className='mt-6 flex items-center justify-between'>
                        <Link to="/signup">
                            <p className='text-richblack-5 flex items-center gap-x-2'>
                                Back To Signup
                            </p>
                        </Link>

                        <button
                            className='flex items-center text-blue-100 gap-x-2'
                            onClick={() => {
                                // resend logic if needed
                                toast.success("OTP Sent again");
                            }}
                        >
                            Resend it
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyEmail
