import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../commponents/common/Sidebar';
import Loader from '../commponents/common/Loader';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const DashBoard = () => {

  const {loading: authLoading} = useSelector( (state) => state.auth );
  const {loading: profileLoading} = useSelector( (state) => state.profile );
  const {token : token} = useSelector( (state) => state.auth );
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if(profileLoading || authLoading) {
    return (
        <Loader />
    )
  }


  return (
    !token? navigate("/login") : 
    <div className='relative w-full bg-gradient-to-br from-richblack-900 via-richblack-900 to-richblack-800 pt-14 h-screen overflow-hidden'>
        {/* Decorative gradient blobs - fixed background layer */}
        <div className='fixed inset-0 pointer-events-none z-0 pt-14 overflow-hidden'>
            <div className='absolute top-10 left-10 w-60 h-60 md:w-96 md:h-96 bg-gradient-to-br from-yellow-400/40 to-yellow-300/20 rounded-full blur-2xl opacity-40'></div>
            <div className='absolute top-1/4 -right-20 w-72 h-72 md:w-[500px] md:h-[500px] bg-gradient-to-bl from-blue-500/35 to-purple-600/25 rounded-full blur-2xl opacity-40'></div>
            <div className='absolute bottom-32 left-1/2 w-60 h-60 md:w-96 md:h-96 bg-gradient-to-tr from-pink-500/35 to-orange-400/25 rounded-full blur-2xl opacity-40'></div>
            <div className='absolute -bottom-20 right-20 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-tl from-cyan-400/35 to-blue-500/25 rounded-full blur-2xl opacity-40'></div>
        </div>
        
        {/* Main content on top of blobs */}
        <div className='relative z-10 flex w-full h-full pt-0 flex-col lg:flex-row'>
            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className='lg:hidden fixed top-[60px] left-4 z-50 px-4 py-2 bg-linear-to-r from-richblack-800 to-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 hover:from-richblack-700 hover:to-richblack-600 hover:border-yellow-400/50 transition-all duration-200 shadow-lg hover:shadow-yellow-400/20 font-semibold flex items-center gap-2'
            >
                {isSidebarOpen ? (
                    <>
                        <AiOutlineClose size={20} className='text-yellow-400' /> 
                        <span className='text-sm'>Back</span>
                    </>
                ) : (
                    <>
                        <AiOutlineMenu size={20} className='text-yellow-400' />
                        <span className='text-sm'>Menu</span>
                    </>
                )}
            </button>

            <div className={`fixed lg:relative top-14 lg:top-0 bottom-0 left-0 z-50 lg:z-10 transition-transform duration-300 h-full ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <Sidebar setOpen={setIsSidebarOpen} />
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className='fixed inset-0 bg-richblack-900/60 z-30 lg:hidden'
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className='flex-1 overflow-y-auto h-full w-full lg:w-auto'>
                <div className='mx-auto w-full md:w-11/12 lg:max-w-[1200px] py-8 md:py-12 px-4 md:px-0 text-richblack-5'>
                    <Outlet />
                </div>
            </div>
        </div>
    </div>
  )
}

export default DashBoard