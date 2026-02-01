import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import EditButton from './EditButton'

const MyProfile = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10">
      {/* Page Title */}
      <h1 className="text-richblack-5 text-3xl font-semibold mb-8">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-richblack-800 p-6 md:p-8 md:px-12 rounded-xl border border-richblack-700 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.image}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-yellow-50"
          />
          <div className="flex flex-col gap-y-1">
            <p className="text-richblack-5 text-lg font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-richblack-300 text-sm">
              {user?.email}
            </p>
          </div>
        </div>

        <EditButton />
      </div>

      {/* About Section */}
      <div className="bg-richblack-800 p-6 md:p-8 md:px-12 rounded-xl mt-6 border border-richblack-700 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-richblack-50 text-xl font-semibold">
            About
          </h2>
          <EditButton />
        </div>

        <p className="text-richblack-200 text-sm leading-relaxed">
          {user?.additionalDetails?.about || 'Write something about yourself...'}
        </p>
      </div>

      {/* Personal Details */}
      <div className="bg-richblack-800 p-6 md:p-8 md:px-12 rounded-xl mt-6 border border-richblack-700 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-richblack-50 text-xl font-semibold">
            Personal Details
          </h2>
          <EditButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-x-10 text-sm">
          <Detail label="First Name" value={user?.firstName} />
          <Detail label="Last Name" value={user?.lastName} />
          <Detail label="Email" value={user?.email} />
          <Detail label="Phone Number" value={user?.additionalDetails?.contact || '—'} />
          <Detail label="Date of Birth" value={user?.additionalDetails?.dateOfBirth || '—'} />
          <Detail label="Gender" value={user?.additionalDetails?.gender || '—'} />
        </div>
      </div>
    </div>
  )
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-richblack-300 mb-1">{label}</p>
    <p className="text-richblack-50 font-medium">{value}</p>
  </div>
)

export default MyProfile
