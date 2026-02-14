import React from "react";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";
import { TiStarFullOutline } from "react-icons/ti";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData?.heading;

  return (
    <div
      className={`flex flex-col w-full font-medium group transition-all duration-300
        max-w-[320px] sm:max-w-[350px] md:max-w-[380px] lg:max-w-[400px] xl:max-w-[420px]
        min-h-[240px] sm:min-h-[260px] md:min-h-[280px] lg:min-h-[300px]
        ${
          isActive
          ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50 lg:scale-105"
          : "bg-richblack-800 rounded-xl border border-richblack-700 hover:border-yellow-100/50 hover:shadow-[0_0_30px_rgba(255,214,10,0.1)] bg-linear-to-br from-richblack-800 to-richblack-900"
      } 
        text-richblack-25 rounded-xl overflow-hidden cursor-pointer 
        hover:scale-[1.03] relative z-10 mx-auto`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      {/* Main Content */}
      <div className={`border-b-[2px] border-dashed p-6 sm:p-8 flex flex-col gap-4 grow transition-colors duration-300 ${
          isActive ? "border-richblack-100" : "border-richblack-600"
      }`}>
        
        <div className="flex justify-between items-start">
            <div
            className={`font-bold text-xl sm:text-2xl line-clamp-2 leading-tight transition-colors duration-300 ${
                isActive ? "text-richblack-800" : "text-richblack-5"
            }`}
            >
            {cardData?.heading}
            </div>
            
            {/* Mock Rating for Homepage Cards */}
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                isActive ? "bg-richblack-800 text-yellow-50" : "bg-richblack-700 text-yellow-100"
            }`}>
                <TiStarFullOutline size={14} />
                <span>4.8</span>
            </div>
        </div>

        <div className={`text-sm sm:text-base line-clamp-3 sm:line-clamp-4 leading-relaxed transition-colors duration-300 ${
            isActive ? "text-richblack-500" : "text-richblack-400"
        }`}>
          {cardData?.description}
        </div>
      </div>

      {/* Footer Stats */}
      <div
        className={`flex justify-between items-center transition-colors duration-300
          ${
          isActive ? "text-blue-500" : "text-richblack-300"
        } 
          px-6 sm:px-8 py-4 sm:py-5 font-semibold text-sm sm:text-base`}
      >
        {/* Level Info */}
        <div className="flex items-center gap-2">
          <HiUsers className={`text-base sm:text-lg ${isActive ? "text-blue-500" : "text-richblack-400"}`} />
          <p>{cardData?.level}</p>
        </div>

        {/* Lessons Info */}
        <div className="flex items-center gap-2">
          <ImTree className={`text-base sm:text-lg ${isActive ? "text-blue-500" : "text-richblack-400"}`} />
          <p>{cardData?.lessionNumber} Lessons</p>
        </div>
      </div>
      
      {/* Hover Background Accent */}
      {!isActive && (
          <div className="absolute inset-0 bg-linear-to-br from-yellow-100/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
    </div>
  );
};

export default CourseCard;
