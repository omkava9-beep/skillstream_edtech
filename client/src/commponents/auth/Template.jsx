import React, { useEffect, useRef } from "react";
import bgimage from "../../assets/Images/frame.png";
import SignUpForm from "./SignupForm";
import { FcGoogle } from "react-icons/fc";
import { gsap } from "gsap";
import LoginForm from "./LoginForm";

const Template = ({ title, des1, des2, formtype, imgmain }) => {
  const compRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".left-section", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".right-section", {
        x: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      });
    }, compRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={compRef}
      className="
        w-full
        min-h-screen
        bg-richblack-900
        flex items-center justify-center
        px-4 sm:px-6 lg:px-10
        /* FIX: Increased top padding (pt-32) to ensure content starts below the Navbar */
        pt-32 pb-12
        overflow-x-hidden
      "
    >
      <div
        className="
          w-full
          max-w-[1160px]
          flex flex-col-reverse
          md:flex-row
          items-center
          md:items-start
          justify-between
          gap-y-12 md:gap-x-12
        "
      >
        {/* ===== FORM SECTION ===== */}
        <div className="left-section relative z-20 w-full max-w-[450px] text-center md:text-left">
          <h1 className="text-richblack-5 font-semibold text-2xl sm:text-3xl leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg mt-4 leading-[1.625rem]">
            <span className="text-richblack-100">{des1}</span>
            <br />
            <span className="text-blue-100 italic font-semibold font-edu-sa">
              {des2}
            </span>
          </p>

          {formtype === "login" ? (
            <LoginForm />
          ) : (
            <SignUpForm />
          )}

          {/* OR Divider */}
          <div className="flex items-center my-6 gap-3">
            <div className="flex-1 h-px bg-richblack-700" />
            <p className="text-richblack-700 text-sm font-medium">OR</p>
            <div className="flex-1 h-px bg-richblack-700" />
          </div>

          {/* Google Button */}
          <button
            className="
              w-full
              flex justify-center items-center gap-2
              rounded-lg
              border border-richblack-700
              px-4 py-3
              text-richblack-100
              hover:bg-richblack-800
              transition-all duration-200
              active:scale-95
            "
          >
            <FcGoogle className="text-xl" />
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* ===== IMAGE SECTION ===== */}
        <div className="right-section relative w-full max-w-[450px] flex justify-center mt-8 md:mt-0">
          {/* Background Frame */}
          <img
            src={bgimage}
            alt="pattern"
            loading="lazy"
            width={558}
            height={504}
            className="
              absolute
              /* Offset to create the shadow frame effect */
              top-4 left-4
              w-full
              object-cover
            "
          />

          {/* Main Image */}
          <img
            src={imgmain}
            alt="students"
            loading="lazy"
            width={558}
            height={504}
            className="
              relative z-10
              w-full
              object-cover
              hover:scale-[1.02]
              transition-transform duration-300
            "
          />
        </div>
      </div>
    </div>
  );
};

export default Template;