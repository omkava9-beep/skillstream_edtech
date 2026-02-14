import React from 'react'
import { Link } from 'react-router-dom';

const DarkButton = ({children, linkto}) => {
  const content = (
    <button className='flex bg-richblack-800 px-4 py-3 sm:py-4 rounded-lg text-[16px]/6 items-center justify-center text-richblack-5 shadow-xl/20 shadow-richblack-50 hover:bg-richblack-700 transition-all duration-200 w-fit'>
      {children}
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

export default DarkButton
