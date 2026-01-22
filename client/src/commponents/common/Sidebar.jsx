import React, { useState, useEffect } from 'react'

import { sidebarLinks } from '../../data/dashboard-links'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { VscSettingsGear, VscSignOut as VscSignOutIcon } from "react-icons/vsc"
import { deleteToken } from '../../redux/slices/authReducer'
import { ACCOUNT_TYPE } from '../../utils/constants'

const Sidebar = () => {

    const {user, loading: profileLoading} = useSelector((state) => state.profile);
    const {loading: authLoading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if(confirmationModal) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Also prevent scroll on all scrollable parent containers
            const scrollableElements = document.querySelectorAll('[style*="overflow"], [class*="overflow"]');
            scrollableElements.forEach(el => {
                if(getComputedStyle(el).overflow === 'auto' || getComputedStyle(el).overflow === 'scroll' || getComputedStyle(el).overflowY === 'auto' || getComputedStyle(el).overflowY === 'scroll') {
                    el.style.overflow = 'hidden';
                }
            });
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
            
            // Restore scroll on all scrollable parent containers
            const scrollableElements = document.querySelectorAll('[style*="overflow"], [class*="overflow"]');
            scrollableElements.forEach(el => {
                el.style.overflow = '';
            });
        }
        
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
    }, [confirmationModal]);

    if(profileLoading || authLoading) {
        return (
            <div className='grid min-w-[220px] items-center border-r border-r-richblack-700/50 bg-gradient-to-b from-richblack-800 to-richblack-900 shadow-xl lg:sticky top-14' style={{ minHeight: 'calc(100vh - 56px)' }}>
                <div className='spinner'></div>
            </div>
        )
    }

  return (
    <div className='flex min-w-[220px] flex-col border-r border-r-richblack-700/50 bg-gradient-to-b from-richblack-800 to-richblack-900 py-10 overflow-y-auto shadow-xl lg:sticky top-14 max-h-[calc(100vh-56px)]' style={{ minHeight: 'calc(100vh - 56px)' }}>

        <div className='flex flex-col'>
            {
                sidebarLinks.map((link) => {
                    if(link.type && user?.accountType !== link.type) return null;
                    return (
                        <SidebarLink key={link.id}  link={link} iconName={link.icon} />
                    )
                })
            }
        </div>
        <div className='mx-auto mt-8 mb-8 h-px w-10/12 bg-gradient-to-r from-transparent via-richblack-600 to-transparent'></div>

        <div className='flex flex-col gap-2 px-2'>
            <SidebarLink 
                link={{name:"Settings", path:"settings"}}
                iconName="VscSettingsGear"
            />

            <button 
                onClick={ () => setConfirmationModal({
                    text1: "Are You Sure ?",
                    text2: "You will be logged out of your Account",
                    btn1Text: "Logout",
                    btn2Text:"Cancel",
                    btn1Handler: () => {
                        dispatch(deleteToken());
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                    },
                    btn2Handler: () => setConfirmationModal(null),
                })}
                className='text-sm font-medium text-richblack-300 hover:text-pink-300 transition-all duration-300'
                >

                <div className='flex items-center gap-x-2 px-4 py-3 rounded-lg hover:bg-pink-500/10 transition-all duration-300 border border-transparent hover:border-pink-500/30'>
                    <VscSignOutIcon className='text-lg' />
                    <span>Logout</span>
                </div>

            </button>

        </div>

        {/* Confirmation Modal should be rendered here if it exists */}
        {/* Placeholder for now as I need to find/create a Modal component */}
        {confirmationModal && (
            <div className='fixed inset-0 mt-0! grid place-items-center overflow-hidden bg-richblack-900 bg-opacity-40 z-[100] pointer-events-auto'>
                <div className='w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6 shadow-2xl pointer-events-auto' onClick={(e) => e.stopPropagation()}>
                    <p className='text-2xl font-semibold text-richblack-5'>{confirmationModal.text1}</p>
                    <p className='mt-3 mb-5 leading-6 text-richblack-200'>{confirmationModal.text2}</p>
                    <div className='flex items-center gap-x-4'>
                        <button 
                            className='cursor-pointer rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-yellow-100 transition-all'
                            onClick={confirmationModal.btn1Handler}
                        >
                            {confirmationModal.btn1Text}
                        </button>
                        <button 
                            className='cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-richblack-300 transition-all'
                            onClick={confirmationModal.btn2Handler}
                        >
                            {confirmationModal.btn2Text}
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  )
}

export default Sidebar
