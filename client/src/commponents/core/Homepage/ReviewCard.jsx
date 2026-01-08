import React from 'react';

// Internal helper to render stars
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
            fill={isFilled ? "#FBBF24" : "#374151"} // Yellow vs Dark Gray
            className="w-4 h-4"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
    </div>
  );
};

const ReviewCard = ({ avatar, name, email, review, rating = 5 }) => {
  return (
    <article className="bg-[#111827] p-6 rounded-lg flex flex-col justify-between h-full border border-gray-800 shadow-sm hover:border-gray-700 transition-colors w-full max-w-sm">
      
      {/* Top Section: User Info & Review */}
      <div>
        <header className="flex items-center gap-3 mb-4">
          <img 
            src={avatar} 
            alt={name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-700" 
          />
          <div className="flex flex-col">
            <h3 className="text-white font-medium text-sm leading-tight">
              {name}
            </h3>
            <span className="text-gray-500 text-xs">
              {email}
            </span>
          </div>
        </header>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {review}
        </p>
      </div>

      {/* Bottom Section: Rating */}
      <footer className="flex items-center gap-2 mt-auto">
        <span className="text-[#FBBF24] font-bold text-sm">
          {rating}
        </span>
        <StarRating rating={rating} />
      </footer>
      
    </article>
  );
};

export default ReviewCard;