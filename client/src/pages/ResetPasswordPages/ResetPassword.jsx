import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { apiConnector } from '../../../services/apiConnector'
import { auth } from '../../../services/apis'
import { toast } from 'react-hot-toast'
import Loader from '../../commponents/common/Loader'

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { token } = useParams()
  if(!token){
    navigate("/login")
  }
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const response = await apiConnector("POST", `${auth.CHANGE_PASSWORD_API}/${token}`, {
        password,
        confirmPassword,
      })

      if (response?.data?.success) {
        toast.success("Password reset successfully")
        navigate("/reset-complete")
      } else {
        toast.error(response?.data?.message || "Something went wrong")
      }
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      toast.error(error?.response?.data?.message || "Reset Password Failed")
    }
    setLoading(false)
  }

  return (
    <>
      {loading && <Loader />}
      <div className="grid min-h-[calc(100vh-4rem)] pt-16 place-items-center">
      <div className="max-w-[500px] p-4 lg:p-8">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
          Choose  new password
        </h1>
        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
          Almost done. Enter your new password and youre all set.
        </p>
        <form onSubmit={handleOnSubmit}>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
          <label className="relative mt-3 block">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between">
          <Link to="/login">
            <p className="flex items-center gap-x-2 text-richblack-5">
              <BiArrowBack /> Back To Login
            </p>
          </Link>
        </div>
      </div>
      </div>
    </>
  )
}

export default ResetPassword
