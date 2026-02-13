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
      <div className="relative flex min-h-[calc(100vh-3.5rem)] pt-14 text-richblack-5">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-richblack-900/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <VideoDetailsSidebar
          setReviewModal={setReviewModal}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            {/* Mobile Menu Button */}
            <div className="md:hidden py-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-richblack-5 cursor-pointer flex items-center gap-2"
              >
                <AiOutlineMenu size={24} />
                <span className="font-semibold">Course Content</span>
              </button>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}