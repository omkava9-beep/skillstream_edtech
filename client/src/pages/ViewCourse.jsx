import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom"

import { getFullDetailsOfCourse } from "../services/operations/courseAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../redux/slices/viewCourseSlice"
import VideoDetailsSidebar from "../commponents/core/ViewCourse/VideoDetailsSidebar"
import CourseReviewModal from "../commponents/core/ViewCourse/CourseReviewModal"

import { AiOutlineMenu } from "react-icons/ai"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [reviewModal, setReviewModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      console.log("Course Data here... ", courseData)
      if (courseData) {
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
        dispatch(setEntireCourseData(courseData.courseDetails))
        dispatch(setCompletedLectures(courseData.completedVideos))
        let lectures = 0
        courseData?.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec.subSection.length
        })
        dispatch(setTotalNoOfLectures(lectures))
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const { courseSectionData } = useSelector((state) => state.viewCourse);

  useEffect(() => {
     // If we have data and we are exactly at /view-course/:courseId (no sub-routes)
     // then redirect to the first video
     if (courseSectionData.length > 0 && 
         location.pathname === `/view-course/${courseId}`
        ) {
            // Find first section with subsections
            for (const section of courseSectionData) {
                if (section.subSection && section.subSection.length > 0) {
                    const firstSubSectionId = section.subSection[0]._id;
                    const firstSectionId = section._id;
                    
                    navigate(`/view-course/${courseId}/section/${firstSectionId}/sub-section/${firstSubSectionId}`, { replace: true })
                    return;
                }
            }
     }
  }, [courseSectionData, courseId, location.pathname])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] pt-14 text-richblack-5 bg-richblack-900">
        {/* Background Decorative Element */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-yellow-100 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-500 rounded-full blur-[150px]"></div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-990 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Container */}
        <div className={`fixed inset-y-0 left-0 z-1000 md:relative md:z-10 bg-richblack-800/60 backdrop-blur-2xl border-r border-richblack-700/50 shadow-2xl transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
            <VideoDetailsSidebar
                setReviewModal={setReviewModal}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile Header Bar */}
            <div className="md:hidden flex items-center justify-between bg-richblack-800/80 backdrop-blur-md rounded-2xl p-4 mb-6 border border-richblack-700/50">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-3 text-richblack-5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-richblack-700 flex items-center justify-center group-active:scale-95 transition-transform">
                    <AiOutlineMenu className="text-xl" />
                </div>
                <div>
                    <h3 className="text-sm font-bold">Course Modules</h3>
                    <p className="text-[10px] text-richblack-400 font-bold uppercase tracking-widest leading-none">Tap to Expand</p>
                </div>
              </button>
              
              <div className="px-3 py-1 bg-yellow-100/10 rounded border border-yellow-100/20 text-[10px] font-bold text-yellow-100">
                LIVE PLAYER
              </div>
            </div>

            <div className="relative z-10 transition-all duration-500">
                <Outlet />
            </div>
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}