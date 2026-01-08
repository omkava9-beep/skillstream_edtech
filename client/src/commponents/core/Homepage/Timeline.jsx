import React from "react";

const Timeline = ({ logo, heading, subheading }) => {
  return (
    <div className="flex items-start gap-3 sm:gap-4 w-full">
      
      {/* Icon */}
      <div className="rounded-full bg-white shadow-lg 
                      p-2 sm:p-3 
                      w-10 h-10 sm:w-12 sm:h-12 
                      flex items-center justify-center 
                      shrink-0">
        <img
          src={logo}
          alt="timeline icon"
          className="w-5 h-5 sm:w-6 sm:h-6"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <span className="font-semibold text-richblack-800 
                         text-sm sm:text-base lg:text-lg">
          {heading}
        </span>
        <p className="text-richblack-700 
                      text-xs sm:text-sm 
                      leading-relaxed">
          {subheading}
        </p>
      </div>

    </div>
  );
};

export default Timeline;
