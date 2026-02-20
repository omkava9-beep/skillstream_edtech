import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"
import { FiVideo, FiCheckCircle } from "react-icons/fi"
import { MdCheckCircle } from "react-icons/md"

import { markLectureAsComplete } from "../../../services/operations/courseAPI"
import { updateCompletedLectures } from "../../../redux/slices/viewCourseSlice"
import IconBtn from "../../../commponents/common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        const filteredVideoData = filteredData?.[0]?.subSection?.filter(
          (data) => data._id === subSectionId
        )
        if (filteredVideoData?.[0]) {
            setVideoData(filteredVideoData[0])
            setPreviewSource(courseEntireData.thumbnail)
            setVideoEnded(false)
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 text-white animate-in fade-in duration-700">
      {/* Video Player Container */}
      <div className="relative group rounded-2xl overflow-hidden bg-richblack-800 border border-richblack-700 shadow-2xl shadow-black/50">
        {!videoData ? (
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full object-cover blur-sm opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-richblack-700 border border-richblack-600 flex items-center justify-center animate-pulse">
                            <FiVideo className="text-3xl text-richblack-400" />
                        </div>
                        <p className="text-richblack-400 font-bold uppercase tracking-widest text-sm">Select a Module to Start</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="relative">
                <Player
                    ref={playerRef}
                    aspectRatio="16:9"
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src={videoData?.videoUrl}
                    className="rounded-2xl"
                >
                    <BigPlayButton position="center" />
                    
                    {/* Glassmorphic Overlay when Video Ends */}
                    {videoEnded && (
                        <div className="absolute inset-0 z-100 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6">
                            <div className="relative group/overlay flex flex-col items-center gap-3 sm:gap-6 md:gap-8 max-w-[260px] sm:max-w-sm w-full text-center">
                                {/* Success Icon/Badge */}
                                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-caribbeangreen-500/10 border border-caribbeangreen-500/20 flex items-center justify-center text-caribbeangreen-100 shadow-[0_0_30px_rgba(5,173,161,0.2)]">
                                    <MdCheckCircle className="text-3xl sm:text-5xl" />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg sm:text-2xl font-black italic tracking-tight">Lesson Mastered!</h3>
                                    <p className="text-xs sm:text-sm text-richblack-400 leading-relaxed italic">You've completed this section of the course. Ready for the next challenge?</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 w-full">
                                    {!completedLectures.includes(subSectionId) && (
                                        <button
                                            disabled={loading}
                                            onClick={() => handleLectureCompletion()}
                                            className="group flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-yellow-100 text-richblack-900 rounded-lg sm:rounded-xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-yellow-50 transition-all border border-yellow-100 hover:border-white shadow-lg"
                                        >
                                            {loading ? "Syncing..." : "Mark as Completed"}
                                        </button>
                                    )}
                                    
                                    <button
                                        disabled={loading}
                                        onClick={() => {
                                            if (playerRef?.current) {
                                                playerRef?.current?.seek(0)
                                                setVideoEnded(false)
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-richblack-800 text-richblack-5 rounded-lg sm:rounded-xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-richblack-700 transition-all border border-richblack-600"
                                    >
                                        Rewatch Lesson
                                    </button>

                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                                        {!isFirstVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToPrevVideo}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-richblack-900 border border-richblack-700 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs text-richblack-300 hover:bg-richblack-800 transition-all"
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {!isLastVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToNextVideo}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-richblack-900 border border-richblack-700 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs text-white hover:bg-richblack-800 transition-all shadow-inner"
                                            >
                                                Next Video
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Player>
            </div>
        )}
      </div>

      {/* Video Info Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 sm:py-6 border-b border-richblack-800">
            <div className="space-y-2">
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-yellow-100/10 text-yellow-100 border border-yellow-100/20 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">Learning in Progress</span>
                <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight bg-linear-to-r from-yellow-100 to-yellow-400 bg-clip-text text-transparent italic leading-tight">
                    {videoData?.title}
                </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-richblack-900 bg-richblack-700"></div>
                    ))}
                </div>
                <p className="text-[10px] sm:text-xs text-richblack-400 font-bold uppercase tracking-wider sm:tracking-widest">Global Students Learning</p>
            </div>
        </div>

        <div className="bg-richblack-800/40 border border-richblack-700/50 rounded-xl sm:rounded-3xl md:rounded-4xl p-3 sm:p-6 md:p-8">
            <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest sm:tracking-[0.2em] text-yellow-100 mb-2 sm:mb-4 opacity-70">About this Module</h3>
            <p className="text-richblack-300 text-xs sm:text-base md:text-lg leading-relaxed italic opacity-90 max-w-4xl">
                {videoData?.description}
            </p>
        </div>
      </div>
    </div>
  )
}

export default VideoDetails
