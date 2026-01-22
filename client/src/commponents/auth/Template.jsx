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
        py-10
        pt-20
        overflow-hidden
      "
    >
      <div
        className="
          w-full max-w-[1200px]
          flex flex-col-reverse
          md:flex-row
          items-center
          md:items-start
          gap-10 md:gap-12
        "
      >

        {/* ===== FORM SECTION ===== */}
        <div className="left-section w-full max-w-[460px] text-center md:text-left">
          <h1 className="text-[#F1F2FF] font-semibold text-2xl sm:text-3xl leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg mt-4">
            <span className="text-[#AFB2BF]">{des1}</span>
            <br />
            <span className="text-[#47A5C5] italic font-semibold">
              {des2}
            </span>
          </p>

          {formtype === "login" ? (
            <LoginForm />
          ) : (
            <SignUpForm />
          )}

          {/* OR Divider */}
          <div className="flex items-center my-4 gap-3">
            <div className="flex-1 h-px bg-[#2C333F]" />
            <p className="text-[#2C333F] text-sm font-medium">OR</p>
            <div className="flex-1 h-px bg-[#2C333F]" />
          </div>

          {/* Google Button */}
          <button
            className="
              w-full
              flex justify-center items-center gap-2
              rounded-lg
              border border-[#2C333F]
              px-4 py-2
              text-[#AFB2BF]
              hover:bg-[#161D29]
              transition
            "
          >
            <FcGoogle className="text-lg" />
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* ===== IMAGE SECTION ===== */}
        <div className="right-section relative w-full max-w-[480px] flex justify-center">
          {/* Background Frame */}
          <img
            src={bgimage}
            alt="pattern"
            loading="lazy"
            className="
              absolute
              top-4 right-4
              w-[85%] sm:w-[90%]
              max-w-[420px]
            "
          />

          {/* Main Image */}
          <img
            src={imgmain}
            alt="students"
            loading="lazy"
            className="
              relative z-10
              w-[85%] sm:w-[90%]
              max-w-[450px]
              hover:scale-[1.03]
              transition-transform duration-300
            "
          />
        </div>

      </div>
    </div>
  );
};

export default Template;
