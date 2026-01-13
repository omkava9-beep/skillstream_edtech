import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setToken } from '../../redux/slices/authReducer'
import { setUser } from '../../redux/slices/profileReducer'
import { apiConnector } from '../../../services/apiConnector'
import {auth} from '../../../services/apis'

import { setSignupData } from '../../redux/slices/authReducer'

const SignUpForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ 
        firstname: '', lastname: '', email: '', password: '', confirmpassword: '' ,accountType: 'Student' 
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const changeHandler = (event) => {
        setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmpassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            // Store signup data in Redux to use after OTP verification
            dispatch(setSignupData(formData));

            // Call SENDOTP API
            const response = await apiConnector("POST", auth.SENDOTP_API, {
                email: formData.email,
            });

            console.log("SENDOTP API RESPONSE............", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("OTP Sent Successfully");
            navigate("/verify-email");

        } catch (error) {
            console.log("SENDOTP API ERROR............", error);
            toast.error(error.response?.data?.message || "Could not send OTP");
        }
    }

    return (
        <div className='mt-6'>
            {/* Tab Switcher */}
            <div className='flex bg-[#161D29] p-1 gap-x-1 my-6 rounded-full max-w-max border-b border-[#AFB2BF]'>
                <button
                    className={`${formData.accountType === "Student" ? "bg-[#000814] text-[#F1F2FF]" : "bg-transparent text-[#999DAA]"} py-2 px-5 rounded-full transition-all duration-200`}
                    onClick={() => {setFormData({...formData , accountType: 'Student'}  )
                }}

                    name='student'
                >
                    Student
                </button>
                <button
                    className={`${formData.accountType === "Instructor" ? "bg-[#000814] text-[#F1F2FF]" : "bg-transparent text-[#999DAA]"} py-2 px-5 rounded-full transition-all duration-200`}
                    name='instructor'
                    onClick={() => { setFormData({ ...formData, accountType: 'Instructor' })
                }}
                >
                    Instructor
                </button>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-y-4'>
                <div className='flex gap-x-4'>
                    <label className='w-full'>
                        <p className='text-[0.875rem] text-[#F1F2FF] mb-1 leading-5.5'>First Name <sup className='text-pink-200'>*</sup></p>
                        <input type="text" required name="firstname" onChange={changeHandler} value={formData.firstname} placeholder="Enter first name" 
                            className='bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF]'/>
                    </label>
                    <label className='w-full'>
                        <p className='text-[0.875rem] text-[#F1F2FF] mb-1 leading-5.5'>Last Name <sup className='text-pink-200'>*</sup></p>
                        <input type="text" required name="lastname" onChange={changeHandler} value={formData.lastname} placeholder="Enter last name" 
                            className='bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF]'/>
                    </label>
                </div>

                <label className='w-full'>
                    <p className='text-[0.875rem] text-[#F1F2FF] mb-1 leading-5.5'>Email Address <sup className='text-pink-200'>*</sup></p>
                    <input type="email" required name="email" onChange={changeHandler} value={formData.email} placeholder="Enter email address" 
                        className='bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF]'/>
                </label>

                <div className='flex gap-x-4'>
                    <label className='w-full relative'>
                        <p className='text-[0.875rem] text-[#F1F2FF] mb-1 leading-5.5'>Create Password <sup className='text-pink-200'>*</sup></p>
                        <input type={showPassword ? "text" : "password"} required name="password" onChange={changeHandler} value={formData.password} placeholder="Enter Password" 
                            className='bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF]'/>
                        <span onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-[38px] cursor-pointer text-[#AFB2BF]'>
                            {showPassword ? <AiOutlineEyeInvisible fontSize={24} /> : <AiOutlineEye fontSize={24} />}
                        </span>
                    </label>

                    <label className='w-full relative'>
                        <p className='text-[0.875rem] text-[#F1F2FF] mb-1 leading-5.5'>Confirm Password <sup className='text-pink-200'>*</sup></p>
                        <input type={showConfirmPassword ? "text" : "password"} required name="confirmpassword" onChange={changeHandler} value={formData.confirmpassword} placeholder="Confirm Password" 
                            className='bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF]'/>
                        <span onClick={() => setShowConfirmPassword(prev => !prev)} className='absolute right-3 top-[38px] cursor-pointer text-[#AFB2BF]'>
                            {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} /> : <AiOutlineEye fontSize={24} />}
                        </span>
                    </label>
                </div>

                <button className='w-full bg-yellow-400 rounded-lg font-medium text-[#000814] px-3 py-2 mt-6 hover:bg-yellow-500 transition-all duration-200'>
                    Create Account
                </button>
            </form>
        </div>
    )
}

export default SignUpForm