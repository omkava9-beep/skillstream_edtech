import React from 'react'
import { HiChatBubbleLeftRight } from "react-icons/hi2"
import { BiWorld } from "react-icons/bi"
import { IoCall } from "react-icons/io5"
import ContactUsForm from '../commponents/core/AboutPage/ContactUsForm'
import Footer from '../commponents/core/Homepage/Footer'

const ContactUs = () => {
    return (
        <div className="bg-gradient-to-br from-richblack-900 via-richblack-900 to-richblack-800 min-h-screen pt-14">
            <div className="mx-auto mt-10 lg:mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-5 lg:flex-row">
                {/* Contact Details */}
                <div className="w-full lg:w-[40%]">
                    <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
                        {/* Chat on us */}
                        <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
                            <div className="flex flex-row items-center gap-3">
                                <HiChatBubbleLeftRight className="text-xl text-richblack-100" />
                                <h1 className="text-lg font-semibold text-richblack-5">Chat on us</h1>
                            </div>
                            <p className="font-medium">Our friendly team is here to help.</p>
                            <p className="font-semibold">@mail address</p>
                        </div>

                        {/* Visit us */}
                        <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
                            <div className="flex flex-row items-center gap-3">
                                <BiWorld className="text-xl text-richblack-100" />
                                <h1 className="text-lg font-semibold text-richblack-5">Visit us</h1>
                            </div>
                            <p className="font-medium">Come and say hello at our office HQ.</p>
                            <p className="font-semibold">Here is the location/ address</p>
                        </div>

                        {/* Call us */}
                        <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
                            <div className="flex flex-row items-center gap-3">
                                <IoCall className="text-xl text-richblack-100" />
                                <h1 className="text-lg font-semibold text-richblack-5">Call us</h1>
                            </div>
                            <p className="font-medium">Mon - Fri From 8am to 5pm</p>
                            <p className="font-semibold">+123 456 7890</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="w-full lg:w-[60%]">
                    <div className="border border-richblack-600 text-richblack-300 rounded-xl p-5 sm:p-7 lg:p-14 flex gap-3 flex-col">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl leading-8 lg:leading-10 font-semibold text-richblack-5">
                            Got a Idea? We've got the skills. Let's team up
                        </h1>
                        <p className="text-sm sm:text-base">
                            Tell us more about yourself and what you've got in mind.
                        </p>
                        <div className="mt-5 lg:mt-7">
                            <ContactUsForm />
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>
                {/* ReviewSlider would go here */}
            </div>

            <Footer />
        </div>
    )
}

export default ContactUs
