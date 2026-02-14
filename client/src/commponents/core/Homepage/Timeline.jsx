import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Timeline = ({ logo, heading, subheading }) => {
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(container.current, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 90%",
        },
      });
    },
    { scope: container }
  );

  return (
    <div className="flex items-start gap-4 sm:gap-6 w-full group" ref={container}>
      
      {/* Icon Container with Glow */}
      <div className="relative shrink-0">
        <div className="absolute inset-0 bg-yellow-100/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative rounded-full bg-white shadow-xl 
                        p-3 sm:p-4 
                        w-12 h-12 sm:w-14 sm:h-14 
                        flex items-center justify-center 
                        border border-richblack-100/10
                        transition-transform duration-300 group-hover:scale-110">
          <img
            src={logo}
            alt="timeline icon"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col pt-1">
        <span className="font-bold text-richblack-800 
                         text-base sm:text-lg lg:text-xl
                         group-hover:text-yellow-100 transition-colors">
          {heading}
        </span>
        <p className="text-richblack-600 
                      text-sm sm:text-base 
                      leading-relaxed max-w-[280px]">
          {subheading}
        </p>
      </div>

    </div>
  );
};

export default Timeline;
