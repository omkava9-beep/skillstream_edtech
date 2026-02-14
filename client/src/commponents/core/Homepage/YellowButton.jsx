import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const YellowButton = ({ children , linkto }) => {
  const content = (
    <button className="inline-flex px-4 items-center gap-2 m-2 max-w-[300px] bg-[#FFD60A] hover:bg-yellow-500 active:scale-95 px-5 sm:px-6 py-3 rounded-lg font-semibold text-richblack-900 text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl w-fit">
      {children}
      <FaArrowRight />
    </button>
  );

  if (linkto) {
    return (
      <Link to={linkto}>
        {content}
      </Link>
    );
  }

  return content;
}

export default YellowButton
