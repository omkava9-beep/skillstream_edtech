import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../commponents/common/Sidebar';
import Loader from '../commponents/common/Loader';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const DashBoard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Early return for loading
  if (profileLoading || authLoading) {
    return <Loader />
  }

  // Auth Guard
  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    /* Adjusted 'pt-24' to 'pt-28' (or lg:pt-32): 
       This ensures the dashboard content starts below the floating Navbar 
    */
    <div className='relative w-full bg-richblack-900 pt-24 lg:pt-28 h-screen overflow-hidden flex flex-col'>
        
        {/* Background Decorative Layer */}
        <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
            <div className='absolute top-20 left-10 w-60 h-60 md:w-96 md:h-96 bg-yellow-400/10 rounded-full blur-[120px]'></div>
            <div className='absolute bottom-20 right-10 w-60 h-60 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-[120px]'></div>
        </div>
        
        {/* Main layout container */}
        <div className='relative z-10 flex flex-1 w-full overflow-hidden flex-col lg:flex-row'>
            
            {/* --- Mobile Menu Toggle --- 
                Moved 'top' to [90px] to sit comfortably below the floating Navbar
            */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className='lg:hidden fixed top-[90px] left-6 z-[60] p-3 bg-richblack-800/90 backdrop-blur-md border border-white/10 rounded-2xl text-yellow-100 shadow-2xl transition-all active:scale-90 flex items-center gap-2'
            >
                {isSidebarOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
                <span className='text-xs font-bold uppercase tracking-wider'>{isSidebarOpen ? 'Close' : 'Menu'}</span>
            </button>

            {/* --- Sidebar --- 
                Adjusted top-0 and padding to align with the dashboard's internal grid
            */}
            <div className={`fixed lg:relative top-0 bottom-0 left-0 z-[70] lg:z-10 transition-transform duration-500 ease-in-out h-full ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <Sidebar setOpen={setIsSidebarOpen} />
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className='fixed inset-0 bg-richblack-900/80 backdrop-blur-sm z-[65] lg:hidden'
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- Main Content Area --- */}
            <div className={`flex-1 overflow-y-auto h-full w-full lg:w-auto custom-scrollbar`}>
                <div className='w-full py-6 md:py-10 px-4 sm:px-8 lg:px-12 xl:px-16 text-richblack-5'>
                    {/* The Outlet renders the nested child routes (Profile, Cart, etc.) */}
                    <div className='max-w-[1200px] mx-auto'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DashBoard