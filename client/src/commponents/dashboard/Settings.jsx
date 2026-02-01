import React from 'react'
import { useSelector } from 'react-redux'
import ChangeProfilePicture from './settings/ChangeProfilePicture'
import EditProfile from './settings/EditProfile'
import UpdatePassword from './settings/UpdatePassword'
import DeleteAccount from './settings/DeleteAccount'

const Settings = () => {
    const {user} = useSelector((state)=>state.profile);

  return (
    <div className='max-w-[1000px] mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10'>
        <h1 className="text-3xl font-medium text-richblack-5">
            Edit Profile
        </h1>

        {/* Change Profile Picture */}
        <ChangeProfilePicture />

        {/* Edit Profile */}
        <EditProfile />

        {/* Update Password */}
        <UpdatePassword />

        {/* Delete Account */}
        <DeleteAccount />
    </div>
  )
}

export default Settings