import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import CountryCode from "../../../data/countrycode.json"
import { updateProfile } from "../../../services/operations/settingsAPI"
import IconBtn from "../../common/IconBtn"
import { setUser } from "../../../redux/slices/profileReducer"


const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    gender: user?.additionalDetails?.gender || "",
    contact: user?.additionalDetails?.contact || "",
    about: user?.additionalDetails?.about || "",
  })

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
      gender: user?.additionalDetails?.gender || "",
      contact: user?.additionalDetails?.contact || "",
      about: user?.additionalDetails?.about || "",
    })
  }, [user])

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    console.log("SUBMITTING PROFILE UPDATE...");
    console.log("TOKEN FROM REDUX:", token);
    console.log("FORM DATA:", formData);
    dispatch(updateProfile(token, formData))
  }

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        {/* Profile Information */}
        <div className="my-6 md:my-10 flex flex-col gap-y-4 md:gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 md:p-8 md:px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="firstName" className="lable-style text-richblack-50 text-[14px]">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                onChange={handleOnChange}
                value={formData.firstName}
              />
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="lastName" className="lable-style text-richblack-50 text-[14px]">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter last name"
                className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                onChange={handleOnChange}
                value={formData.lastName}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="dateOfBirth" className="lable-style text-richblack-50 text-[14px]">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                onChange={handleOnChange}
                value={formData.dateOfBirth}
              />
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="gender" className="lable-style text-richblack-50 text-[14px]">
                Gender
              </label>
              <select
                type="text"
                name="gender"
                id="gender"
                className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                onChange={handleOnChange}
                value={formData.gender}
              >
                {genders.map((ele, i) => {
                  return (
                    <option key={i} value={ele}>
                      {ele}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="contact" className="lable-style text-richblack-50 text-[14px]">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                id="contact"
                placeholder="Enter Contact Number"
                className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                onChange={handleOnChange}
                value={formData.contact}
              />
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="about" className="lable-style text-richblack-50 text-[14px]">
                About
              </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Enter Bio Details"
                className="form-style bg-[#161D29] rounded-lg text-[#F1F2FF] w-full p-3 border-b border-[#AFB2BF] focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                onChange={handleOnChange}
                value={formData.about}
              />
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
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  )
}
