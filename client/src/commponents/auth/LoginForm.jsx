import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setToken } from '../../redux/slices/authReducer'
import { setUser } from '../../redux/slices/profileReducer'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { toast } from 'react-hot-toast'
import { auth } from '../../../services/apis'
import { gsap } from 'gsap'
import { apiConnector } from '../../../services/apiConnector'

const LoginForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const formRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(formRef.current.children, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
        )
    }, [])

    function changeHandler(event) {
        setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try{
            const api_url = auth.AUTH_API;
            const resp = await apiConnector('POST' , api_url , { email : formData.email , password : formData.password});
            console.log(resp);

            if(!resp.data.success){
                throw new Error(resp.data.message);
            }
            dispatch(setToken(resp.data.token));
            const userImage = resp.data?.user?.image? resp.data.user.image : 'https://api.dicebear.com/5.x/initials/svg?seed='+resp.data.user.name;
            dispatch(setUser({name : resp.data.user.name , email : resp.data.user.email , image : userImage}));
        
            localStorage.setItem('token' , resp.data.token);
            localStorage.setItem('user' , JSON.stringify(resp.data.user));
            navigate('/dashboard');
            console.log(userImage)
        } catch(e) {
            console.log("LOGIN API ERROR............", e)
            toast.error(e.response?.data?.message || "Login Failed")
        }
    }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='flex flex-col w-full gap-y-4 mt-6'>
        <label className='w-full'>
            <p className='text-[0.875rem] text-[#F1F2FF] mb-1 leading-5.5'>
                Email Address <sup className='text-pink-200'>*</sup>
            </p>
            <input 
                required
                type="email" 
                name='email'
                value={formData.email}
                onChange={changeHandler}
                placeholder='Enter email address'
                className='bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200'
            />
        </label>

        <label className='w-full relative'>
            <p className='text-[0.875rem] text-[#F1F2FF] mb-1 leading-5.5'>
                Password <sup className='text-pink-200'>*</sup>
            </p>
            <input 
                required
                type={showPassword ? 'text' : 'password'} 
                name='password'
                value={formData.password}
                onChange={changeHandler}
                placeholder='Enter Password'
                className='bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200'
            />
            <span 
                onClick={() => setShowPassword(prev => !prev)} 
                className='absolute right-3 top-[38px] cursor-pointer text-[#AFB2BF] hover:text-white transition-colors duration-200'
            >
                {showPassword ? <AiOutlineEyeInvisible fontSize={24}/> : <AiOutlineEye fontSize={24}/>}
            </span>
            
            <Link to='/forgot-password'>
                <p className='text-xs mt-1 text-[#47A5C5] hover:text-[#5eb7d6] ml-auto w-max transition-colors duration-200'>
                    Forgot Password?
                </p>
            </Link>
        </label>

        <button 
            type="submit"
            className='bg-[#FFD60A] rounded-lg font-bold text-[#000814] px-3 py-2 mt-6 hover:bg-[#ffe668] hover:scale-95 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]'
        >
            Login
        </button>
    </form>
  )
}

export default LoginForm