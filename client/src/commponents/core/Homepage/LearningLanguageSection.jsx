import React, { useRef } from "react";
import HighlightedText from "./HighlightedText";
import YellowButton from "./YellowButton";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LearningLanguageSection = ({ img1, img2, img3 }) => {
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".language-img", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      });
    },
    { scope: container }
  );

  return (
    <div className="flex flex-col items-center bg-pure-greys-5 gap-10 sm:gap-[52px]" ref={container}>

      {/* ===== Heading ===== */}
      <div className="w-11/12 text-richblack-900 font-inter flex flex-col items-center mt-16 sm:mt-28 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
          Your swiss knife for{" "}
          <HighlightedText text="learning any language" />
        </h1>

        <p className="text-richblack-700 text-sm sm:text-base leading-6 max-w-3xl font-medium mt-3">
          Using spin making learning multiple languages easy. With 20+ languages,
          realistic voice-over, progress tracking, custom schedule and more.
        </p>
      </div>

      {/* ===== Images ===== */}
      <div className="relative flex items-center justify-center w-full max-w-7xl">

        {/* Left image */}
        <img
          src={img1}
          alt=""
          className="
            absolute
            left-0 sm:left-16 lg:left-32 xl:left-44
            w-32 sm:w-44 md:w-56 lg:w-64 xl:w-72 2xl:w-80
            language-img
          "
        />

        {/* Center image */}
        <img
          src={img3}
          alt=""
          className="
            relative z-10
            w-40 sm:w-56 md:w-72 lg:w-80 xl:w-96 2xl:w-md
            language-img
          "
        />

        {/* Right image */}
        <img
          src={img2}
          alt=""
          className="
            absolute
            right-0 sm:right-16 lg:right-32 xl:right-44
            w-32 sm:w-44 md:w-56 lg:w-64 xl:w-72 2xl:w-80
            language-img
          "
        />

      </div>

      {/* ===== Button ===== */}
      <div className="h-24 sm:h-36 flex items-center justify-center">
        <YellowButton>Learn more</YellowButton>
      </div>

    </div>
  );
};

export default LearningLanguageSection;
