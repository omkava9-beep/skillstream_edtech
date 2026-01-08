import React from 'react'
import { FaArrowRight } from "react-icons/fa6";

const YellowButton = ({ children , big }) => {
  return (
    <button className="inline-flex items-center gap-2 max-w-[300px] bg-[#FFD60A] hover:bg-yellow-500 active:scale-95 px-5 sm:px-6 py-3 rounded-lg font-semibold text-richblack-900 text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl">
      {children}
      <FaArrowRight />
    </button>
  )
}

export default YellowButton
