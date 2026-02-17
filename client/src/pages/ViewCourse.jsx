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
    const getCourseSpecificDetails = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
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
    }
    getCourseSpecificDetails()
  }, [courseId, token, dispatch])

  const { courseSectionData } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    if (courseSectionData.length > 0 && location.pathname === `/view-course/${courseId}`) {
      for (const section of courseSectionData) {
        if (section.subSection && section.subSection.length > 0) {
          navigate(`/view-course/${courseId}/section/${section._id}/sub-section/${section.subSection[0]._id}`, { replace: true })
          return
        }
      }
    }
  }, [courseSectionData, courseId, location.pathname, navigate])

  return (
    <>
      {/* REMOVED pt-[64px] to eliminate the top gap. 
          Changed h-screen to min-h-[calc(100vh-navbarHeight)] if needed, 
          but pt-0 fills the entire space.
      */}
      <div className="relative flex w-full h-screen pt-0 bg-richblack-900 overflow-hidden">
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-[150] bg-richblack-900/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`
            fixed md:relative top-0 bottom-0 left-0 z-[160] md:z-10 
            h-full transition-all duration-300 ease-in-out 
            bg-richblack-800 border-r border-white/5
            ${sidebarOpen ? "translate-x-0 w-[280px] sm:w-[320px]" : "-translate-x-full md:translate-x-0 md:w-[300px] lg:w-[350px] xl:w-[400px]"}
          `}
        >
          <VideoDetailsSidebar
            setReviewModal={setReviewModal}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-richblack-900">
          <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
            
            {/* Mobile Toggle Bar */}
            <div className="md:hidden flex items-center justify-between bg-white/[0.03] backdrop-blur-md rounded-2xl p-3 mb-4 border border-white/5">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-3 text-richblack-5"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-100/10 flex items-center justify-center text-yellow-100">
                  <AiOutlineMenu className="text-xl" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider">Modules</span>
              </button>
              <div className="text-[10px] font-bold text-caribbeangreen-200 bg-caribbeangreen-500/10 px-2 py-1 rounded">PLAYER MODE</div>
            </div>

            {/* Video Player Container */}
            <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl">
              <Outlet />
            </div>

            {/* Footer space */}
            <div className="mt-8 pb-10">
                {/* Content below the video can go here */}
            </div>
          </div>
        </div>
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}