import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../commponents/common/Sidebar';
import Loader from '../commponents/common/Loader';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const DashBoard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // LOGIC TO HIDE GLOBAL NAVBAR
  useEffect(() => {
    const navbar = document.querySelector("nav"); // Targets your Navbar component
    if (navbar) {
      if (isSidebarOpen) {
        navbar.style.transform = "translateY(-100%)";
        navbar.style.transition = "transform 0.4s ease-in-out";
      } else {
        navbar.style.transform = "translateY(0)";
      }
    }
  }, [isSidebarOpen]);

  if (profileLoading || authLoading) return <Loader />
  if (!token) { navigate("/login"); return null; }

  return (
    <div className='relative w-full bg-richblack-900 pt-24 lg:pt-28 h-screen overflow-hidden flex flex-col'>
        
        {/* Main layout container */}
        <div className='relative z-10 flex flex-1 w-full overflow-hidden flex-col lg:flex-row'>
            
            {/* Toggle Button - Lowered slightly to not overlap where Navbar used to be */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`lg:hidden fixed left-6 z-1000 p-3 bg-richblack-800 border border-white/20 rounded-2xl text-yellow-100 shadow-2xl transition-all duration-500 ${
                  isSidebarOpen ? "top-8" : "top-[110px]"
                }`}
            >
                {isSidebarOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
            </button>

            {/* Sidebar - Higher Z-index to ensure it sits on top of everything */}
            <div className={`fixed lg:relative top-0 bottom-0 left-0 z-1100 transition-transform duration-500 ease-in-out h-full ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <Sidebar setOpen={setIsSidebarOpen} />
            </div>

            {/* Mobile Overlay - Darkens everything including the area where Navbar was */}
            {isSidebarOpen && (
                <div 
                    className='fixed inset-0 bg-richblack-900/95 backdrop-blur-md z-1050 lg:hidden'
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content Area */}
            <div className='flex-1 overflow-y-auto h-full w-full lg:w-auto no-scrollbar'>
                <div className='w-full py-6 md:py-10 px-4 sm:px-8 lg:px-12 xl:px-16 text-richblack-5'>
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