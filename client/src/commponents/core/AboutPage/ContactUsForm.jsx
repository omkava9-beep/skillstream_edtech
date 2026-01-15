import React, { useState } from 'react'
import countrycode from '../../../data/countrycode.json'
import toast from 'react-hot-toast'
import { apiConnector } from '../../../../services/apiConnector'
import { contact } from '../../../../services/apis'

const ContactUsForm = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        message: "",
        phoneNo: "",
        countryCode: "+91"
    })

    const changeHandler = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await apiConnector('POST' , contact.CONTACT_API , formData);
            if(response.status === 200){
                toast.success(response.data.message);
            }
            else{
                toast.error(response.data.message);
            }
            
        } catch (error) {
            console.log("CONTACT API ERROR:", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 lg:flex-row">
                {/* First Name */}
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstname" className="text-[0.875rem] text-richblack-5">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter first name"
                        className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-[12px] border-b border-richblack-500"
                        onChange={changeHandler}
                        value={formData.firstname}
                    />
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="lastname" className="text-[0.875rem] text-richblack-5">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        placeholder="Enter last name"
                        className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-[12px] border-b border-richblack-500"
                        onChange={changeHandler}
                        value={formData.lastname}
                    />
                </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[0.875rem] text-richblack-5">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email address"
                    className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-[12px] border-b border-richblack-500"
                    onChange={changeHandler}
                    value={formData.email}
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
                <label htmlFor="phoneNo" className="text-[0.875rem] text-richblack-5">
                    Phone Number
                </label>

                <div className="flex gap-5">
                    {/* Dropdown */}
                    <div className="flex w-[81px] flex-col gap-2">
                        <select
                            name="countryCode"
                            id="countryCode"
                            className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-[12px] border-b border-richblack-500"
                            onChange={changeHandler}
                            value={formData.countryCode}
                        >
                            {countrycode.map((element, index) => {
                                return (
                                    <option key={index} value={element.code}>
                                        {element.code} - {element.country}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Phone Number Input */}
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                            type="number"
                            name="phoneNo"
                            id="phoneNo"
                            placeholder="12345 67890"
                            className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-[12px] border-b border-richblack-500"
                            onChange={changeHandler}
                            value={formData.phoneNo}
                        />
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[0.875rem] text-richblack-5">
                    Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    cols="30"
                    rows="7"
                    placeholder="Enter your message here"
                    className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-[12px] border-b border-richblack-500"
                    onChange={changeHandler}
                    value={formData.message}
                />
            </div>

            <button
                type="submit"
                className="rounded-md bg-yellow-50 text-center px-6 py-3 text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:scale-95 transition-all duration-200"
            >
                Send Message
            </button>
        </form>
    )
}

export default ContactUsForm
