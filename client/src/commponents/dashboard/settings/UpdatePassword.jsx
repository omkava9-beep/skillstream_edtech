import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../services/operations/settingsAPI"
import IconBtn from "../../common/IconBtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const { oldPassword, newPassword, confirmNewPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match")
      return
    }
    changePassword(token, formData)
  }

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div className="my-6 md:my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 md:p-8 md:px-12">
          <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="relative flex flex-col gap-2 md:w-1/2">
              <label htmlFor="oldPassword" className="lable-style text-richblack-50 text-[14px]">
                Current Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                onChange={handleOnChange}
                value={oldPassword}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>
            <div className="relative flex flex-col gap-2 md:w-1/2">
              <label htmlFor="newPassword" className="lable-style text-richblack-50 text-[14px]">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                onChange={handleOnChange}
                value={newPassword}
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="relative flex flex-col gap-2 md:w-1/2">
                <label htmlFor="confirmPassword" className="lable-style text-richblack-50 text-[14px]">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  placeholder="Confirm New Password"
                  className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  onChange={handleOnChange}
                  value={confirmNewPassword}
                />
                <span
                  onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                  {showConfirmNewPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 mt-4 md:mt-0">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="cursor-pointer rounded-md bg-richblack-700 hover:bg-richblack-600 py-2 px-4 md:px-5 font-semibold text-richblack-50 transition-all text-sm md:text-base"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update" />
        </div>
      </form>
    </>
  )
}
