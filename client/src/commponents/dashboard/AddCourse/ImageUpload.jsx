import React, { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

const ImageUpload = ({ thumbnail, setThumbnail }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  useEffect(() => {
    if (thumbnail && typeof thumbnail === 'string') {
        setPreview(thumbnail);
    }
  }, [thumbnail]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please upload a valid image file (JPG, JPEG, or PNG)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 5MB');
      return;
    }

    // Set the file
    setThumbnail(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setThumbnail(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-richblack-5 text-sm font-medium mb-2">
        Course Thumbnail <span className="text-pink-200">*</span>
      </label>

      {!preview ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-caribbeangreen-300 bg-caribbeangreen-900/20'
              : 'border-richblack-600 bg-richblack-700 hover:border-richblack-500 hover:bg-richblack-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragging
                  ? 'bg-caribbeangreen-700'
                  : 'bg-richblack-600'
              }`}
            >
              <FiUploadCloud
                size={32}
                className={isDragging ? 'text-caribbeangreen-50' : 'text-richblack-300'}
              />
            </div>

            <p className="text-richblack-5 font-medium mb-1">
              {isDragging ? 'Drop image here' : 'Drag and drop an image, or Browse'}
            </p>
            <p className="text-richblack-400 text-sm mb-4">
              Max 5MB • JPG, JPEG, PNG
            </p>

            <button
              type="button"
              className="bg-yellow-50 text-richblack-900 px-6 py-2 rounded-lg font-medium hover:bg-yellow-100 transition-colors"
            >
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-richblack-600 rounded-xl p-4 bg-richblack-700">
          <div className="flex items-start gap-4">
            {/* Image Preview */}
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-richblack-600 shrink-0 relative">
              {preview ? (
                <img
                  src={preview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-richblack-800">
                  <FiImage className="text-richblack-400 mb-1" size={24} />
                  <p className="text-[10px] text-pink-200">Re-selection required</p>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FiImage className="text-caribbeangreen-200 shrink-0" size={18} />
                    <p className="text-richblack-5 font-medium truncate">
                      {thumbnail?.name || "Course Thumbnail"}
                    </p>
                  </div>
                  <p className="text-richblack-400 text-sm">
                    {thumbnail?.size ? (thumbnail.size / 1024).toFixed(2) + " KB" : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="ml-4 p-2 rounded-lg bg-richblack-600 hover:bg-pink-700 text-richblack-300 hover:text-pink-50 transition-all"
                  title="Remove image"
                >
                  <FiX size={18} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleClick}
                className="mt-3 text-caribbeangreen-200 hover:text-caribbeangreen-100 text-sm font-medium transition-colors"
              >
                Replace Image
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-richblack-400 text-xs mt-2">
        Recommended: 16:9 aspect ratio for best display
      </p>
    </div>
  );
};

export default ImageUpload;
