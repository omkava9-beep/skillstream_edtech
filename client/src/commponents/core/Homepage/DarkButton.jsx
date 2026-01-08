import React from 'react'

const DarkButton = ({children}) => {
  return (
    <div>
      <button className='flex bg-richblack-800 h-10 px-4 py-8 sm:h-12  sm:py-6 rounded-lg text-[16px]/6 items-center justify-center text-richblack-5v shadow-xl/20  shadow-richblack-50 w-[100%] hover:bg-richblack-700 transition-all duration-200 '>
        {children}
      </button>
    </div>
  )
}

export default DarkButton
