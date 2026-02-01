import React from 'react'

const EnrolledCourses = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-richblack-5 text-3xl font-semibold mb-8">
        Enrolled Courses
      </h1>
      <div className="bg-richblack-800 p-6 md:p-8 rounded-xl border border-richblack-700 text-richblack-300 text-center">
        No courses enrolled yet.
      </div>
    </div>
  )
}

export default EnrolledCourses