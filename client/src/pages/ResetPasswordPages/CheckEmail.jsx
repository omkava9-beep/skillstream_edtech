import React, { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { Link, useLocation } from "react-router-dom"
import { apiConnector } from "../../../services/apiConnector"
import { auth } from "../../../services/apis"
import toast from "react-hot-toast"
import Loader from "../../commponents/common/Loader"


const CheckEmail = () => {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const email = location.state?.email || "youremailaccount@gmail.com"

  const handleResendEmail = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("POST", auth.MAIL_SENDER_API, { email })
      if (response?.data?.success) {
        toast.success("Email sent successfully")
      } else {
        toast.error(response?.data?.message || "Something went wrong")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend email")
    }
    setLoading(false)
  }

  return (
    <>
      {loading && <Loader />}
      <div className="grid min-h-[calc(100vh-4rem)] pt-16 place-items-center">
      <div className="max-w-[500px] p-4 lg:p-8">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
          Check email
        </h1>
        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
          We have sent the reset email to <br />
          {email}
        </p>

        <button
          onClick={handleResendEmail}
          className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
        >
          Resend email
        </button>

        <div className="mt-6 flex items-center justify-between">
          <Link to="/login">
            <p className="flex items-center gap-x-2 text-richblack-5">
              <BiArrowBack /> Back to login
            </p>
          </Link>
        </div>
      </div>
      </div>
    </>
  )
}

export default CheckEmail
