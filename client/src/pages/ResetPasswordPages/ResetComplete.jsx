import React from "react"
import { BiArrowBack } from "react-icons/bi"
import { Link } from "react-router-dom"

const ResetComplete = () => {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] pt-16 place-items-center">
      <div className="max-w-[500px] p-4 lg:p-8 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-caribbeangreen-500/20 rounded-full flex items-center justify-center mb-6">
            <svg 
                className="w-12 h-12 text-caribbeangreen-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3" 
                    d="M5 13l4 4L19 7"
                />
            </svg>
        </div>
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
          Reset Complete!
        </h1>
        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
          All set! We have successfully reset your password. 
          You can now close this window or return to login.
        </p>
        <Link to="/login" className="w-full">
            <button className="w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 mt-2">
                Return to login
            </button>
        </Link>
        <div className="mt-6">
          <Link to="/login">
            <p className="flex items-center gap-x-2 text-richblack-5">
              <BiArrowBack /> Back To Login
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetComplete
