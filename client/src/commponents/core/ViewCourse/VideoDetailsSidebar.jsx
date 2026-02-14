import { IoIosArrowBack, IoMdClose } from "react-icons/io"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { MdOutlinePlayCircle, MdCheckCircle, MdLockOutline } from "react-icons/md"
import { FiChevronDown, FiVideo, FiCheck } from "react-icons/fi"

import IconBtn from "../../common/IconBtn"
import { markLectureAsComplete } from "../../../services/operations/courseAPI"
import { updateCompletedLectures } from "../../../redux/slices/viewCourseSlice"
import { useEffect, useState } from "react"

export default function VideoDetailsSidebar({ setReviewModal, sidebarOpen, setSidebarOpen }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { sectionId, subSectionId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  const handleLectureCompletion = async (courseId, subSectionId) => {
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
  }

  return (
    <>
      <div className={`h-full w-[320px] max-w-[350px] flex flex-col bg-transparent text-richblack-5`}>
        {/* Header Section */}
        <div className="px-6 py-8 border-b border-richblack-700/50">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
              className="group flex items-center gap-2 text-richblack-300 hover:text-white transition-colors"
              title="Return to Dashboard"
            >
              <div className="w-8 h-8 rounded-lg bg-richblack-800 flex items-center justify-center border border-richblack-700 group-hover:border-yellow-100/50 transition-all">
                <IoIosArrowBack size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setReviewModal(true)}
                className="px-3 py-1.5 bg-yellow-100 text-richblack-900 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-yellow-50 transition-colors shadow-[0_0_15px_rgba(255,214,10,0.3)]"
              >
                Add Review
              </button>
              {/* Mobile Close Button */}
              <button className="md:hidden w-8 h-8 rounded-lg bg-richblack-800 flex items-center justify-center border border-richblack-700 text-richblack-300" onClick={() => setSidebarOpen(false)}>
                 <IoMdClose size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-black leading-tight bg-linear-to-r from-yellow-100 to-yellow-400 bg-clip-text text-transparent">
              {courseEntireData?.courseName}
            </h2>
            
            {/* Progress Bar Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-richblack-400">
                <span>Course Completion</span>
                <span className="text-yellow-100">{Math.round((completedLectures?.length / totalNoOfLectures) * 100) || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-richblack-700 rounded-full overflow-hidden p-[1px]">
                <div 
                    className="h-full bg-linear-to-r from-yellow-100 to-yellow-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,214,10,0.4)]"
                    style={{ width: `${(completedLectures?.length / totalNoOfLectures) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-richblack-500 font-bold italic">
                {completedLectures?.length} of {totalNoOfLectures} Modules Mastery
              </p>
            </div>
          </div>
        </div>

        {/* Course Content Sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 pb-12 px-2">
          {courseSectionData.map((section, index) => (
            <div key={index} className="mb-2 group/sec">
              {/* Section Header */}
              <div 
                className={`flex items-center justify-between px-4 py-4 cursor-pointer rounded-xl transition-all duration-300 ${activeStatus === section?._id ? "bg-richblack-700/40 border border-richblack-600/50 shadow-inner" : "hover:bg-richblack-800/40 border border-transparent"}`}
                onClick={() => setActiveStatus(activeStatus === section?._id ? "" : section?._id)}
              >
                <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold border ${activeStatus === section?._id ? "bg-yellow-100/10 border-yellow-100/50 text-yellow-100" : "bg-richblack-700 border-richblack-600 text-richblack-400"}`}>
                        {index + 1}
                    </div>
                    <span className={`text-sm font-bold tracking-tight ${activeStatus === section?._id ? "text-white" : "text-richblack-200"}`}>
                        {section?.sectionName}
                    </span>
                </div>
                <FiChevronDown className={`text-richblack-400 transition-transform duration-500 ${activeStatus === section?._id ? "rotate-180 text-yellow-100" : ""}`} />
              </div>

              {/* SubSections with Progress Indicators */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeStatus === section?._id ? "max-h-[1000px] mt-2" : "max-h-0"}`}>
                <div className="space-y-1 mx-2">
                  {section.subSection.map((subSection, i) => (
                    <div
                      key={i}
                      className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                        videoBarActive === subSection._id
                          ? "bg-linear-to-r from-yellow-100/10 to-transparent border-yellow-100/30"
                          : "hover:bg-richblack-800/30 border-transparent hover:border-richblack-700"
                      }`}
                      onClick={() => {
                        navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${subSection?._id}`)
                        setVideoBarActive(subSection?._id)
                      }}
                    >
                      {/* Active Indicator Line */}
                      {videoBarActive === subSection._id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-yellow-100 rounded-full shadow-[0_0_8px_rgba(255,214,10,0.8)]"></div>
                      )}

                      {/* Checkbox / Completion Icon */}
                      <div 
                        className="relative z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLectureCompletion(courseEntireData?._id, subSection?._id)
                        }}
                      >
                        {completedLectures.includes(subSection?._id) ? (
                            <div className="w-5 h-5 rounded-full bg-caribbeangreen-500/20 border border-caribbeangreen-500/50 flex items-center justify-center text-caribbeangreen-100">
                                <FiCheck className="text-[10px]" />
                            </div>
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-richblack-700 border border-richblack-600 group-hover:border-yellow-100/50 transition-colors"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${videoBarActive === subSection._id ? "text-yellow-50" : "text-richblack-300 group-hover:text-richblack-100"}`}>
                          {subSection.title}
                        </p>
                      </div>

                      {videoBarActive === subSection._id ? (
                        <MdCheckCircle className="text-yellow-100 text-sm animate-pulse" />
                      ) : (
                        <MdOutlinePlayCircle className="text-richblack-600 group-hover:text-richblack-400 text-sm" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
