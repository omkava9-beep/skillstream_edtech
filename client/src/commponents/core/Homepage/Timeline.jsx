import React from "react";

const Timeline = ({ logo, heading, subheading }) => {
  return (
    <div className="flex items-start gap-4 w-full max-w-md">
      <div className="rounded-full bg-white shadow-lg p-2 w-12 h-12 flex items-center justify-center shrink-0">
        <img src={logo} alt="timeline icon" className="w-6 h-6" />
      </div>

      <div>
        <span className="font-semibold text-richblack-800 text-base sm:text-lg">
          {heading}
        </span>
        <p className="text-richblack-700 text-sm">
          {subheading}
        </p>
      </div>
    </div>
  );
};

export default Timeline;
