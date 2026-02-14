import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ImagePreviewModal = ({ imageSrc, onClose }) => {
  if (!imageSrc) return null;

  return (
    <div 
      className="fixed inset-0 z-1000 mt-0! grid place-items-center overflow-auto bg-richblack-900 bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] bg-richblack-800 p-2 rounded-lg border border-richblack-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 -right-2 text-richblack-5 hover:text-yellow-50 transition-all duration-200"
        >
          <AiOutlineClose size={32} />
        </button>
        
        <img 
          src={imageSrc} 
          alt="Preview" 
          className="max-w-full max-h-[85vh] object-contain rounded-md"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
