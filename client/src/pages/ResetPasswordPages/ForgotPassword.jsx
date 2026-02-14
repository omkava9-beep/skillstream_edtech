import React, { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { Link, useNavigate } from "react-router-dom"
import {apiConnector} from "../../../services/apiConnector"
import {auth} from "../../../services/apis"
import toast from "react-hot-toast"
import Loader from "../../commponents/common/Loader"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    try {
        const response = await apiConnector('POST' , auth.MAIL_SENDER_API , {email});
        if(response?.data?.success){
            toast.success(response?.data?.message);
            navigate("/check-email", { state: { email } })
        }
        else{
            toast.error(response?.data?.message);
        }
    }catch (error) {
        toast.error(error?.response?.data?.message || "Failed to send email");
    }
    setLoading(false)
}

  return (
    <>
      {loading && <Loader />}
      <div className="grid min-h-[calc(100vh-4rem)] pt-16 place-items-center">
      <div className="max-w-[500px] p-4 lg:p-8">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
          Reset your password
        </h1>
        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
          Have no fear. We&apos;ll email you instructions to reset your password.
          If you dont have access to your email we can try account recovery
        </p>
        <form onSubmit={handleSubmit}>
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
            />
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

export default ForgotPassword
