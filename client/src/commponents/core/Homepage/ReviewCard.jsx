import React, { useState } from "react";

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const isFilled = index < Math.floor(rating);
        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFilled ? "#FBBF24" : "#374151"}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
    </div>
  );
};

const ReviewCard = ({ avatar, name, email, review = "", rating = 5, courseName }) => {
  const [shown, setShown] = useState(false);
  
  // Define truncation limit
  const maxLength = 100;
  const isLongReview = review.length > maxLength;

  return (
    <article
      className="
        bg-white/5 backdrop-blur-md
        w-full sm:max-w-sm lg:max-w-md
        p-4 sm:p-6
        rounded-2xl
        flex flex-col justify-between 
        min-h-[200px] h-fit
        border border-white/10
        shadow-2xl shadow-black/20
        transition-all duration-500
        hover:border-yellow-100/30
        hover:bg-white/10
        hover:scale-[1.02]
        group
      "
    >
      <div>
        <header className="flex items-center gap-3 mb-3 sm:mb-4">
          <img
            src={avatar}
            alt={name}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white/20 group-hover:border-yellow-100/50 transition-colors"
          />
          <div className="flex flex-col">
            <h3 className="text-white font-medium text-sm sm:text-base leading-tight">
              {name}
            </h3>
            <span className="text-gray-500 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">
              {email}
            </span>
            {courseName && (
              <span className="text-yellow-100/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">
                {courseName}
              </span>
            )}
          </div>
        </header>

        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
          {/* Main Review Logic */}
          {shown ? review : `${review.substring(0, maxLength)}`}
          
          {isLongReview && (
            <button
              onClick={() => setShown(!shown)}
              className="ml-1 text-yellow-100/70 hover:text-yellow-100 font-bold uppercase text-[10px] transition-colors"
            >
              {shown ? " Show Less" : "... Read More"}
            </button>
          )}
        </p>
      </div>

      <footer className="flex items-center gap-2 mt-4">
        <span className="text-[#FBBF24] font-bold text-sm sm:text-base">
          {rating}
        </span>
        <StarRating rating={rating} />
      </footer>
    </article>
  );
};

export default ReviewCard;