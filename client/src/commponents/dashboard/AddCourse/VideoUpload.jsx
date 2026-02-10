import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiVideo, FiPlay } from 'react-icons/fi';

const VideoUpload = ({ video, setVideo, subSectionId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

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
      alert('Please upload a valid video file (MP4, WebM, OGG, or MOV)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 100MB');
      return;
    }

    // Set the file
    setVideo(file);

    // Create preview URL
    const videoUrl = URL.createObjectURL(file);
    setPreview(videoUrl);
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setVideo(null);
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
      {!preview && !video ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-caribbeangreen-300 bg-caribbeangreen-900/20'
              : 'border-richblack-500 bg-richblack-600 hover:border-richblack-400 hover:bg-richblack-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                isDragging ? 'bg-caribbeangreen-700' : 'bg-richblack-500'
              }`}
            >
              <FiUploadCloud
                size={24}
                className={isDragging ? 'text-caribbeangreen-50' : 'text-richblack-300'}
              />
            </div>

            <p className="text-richblack-5 font-medium text-sm mb-1">
              {isDragging ? 'Drop video here' : 'Drag and drop video, or Browse'}
            </p>
            <p className="text-richblack-400 text-xs">
              Max 100MB • MP4, WebM, OGG, MOV
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-richblack-500 rounded-lg p-3 bg-richblack-600">
          <div className="flex items-start gap-3">
            {/* Video Preview */}
            <div className="w-24 h-16 rounded bg-richblack-700 flex-shrink-0 overflow-hidden relative group">
              {preview ? (
                <>
                  <video
                    src={preview}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-richblack-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiPlay className="text-caribbeangreen-200" size={20} />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-richblack-800 p-1 text-center font-bold">
                   <FiVideo className="text-richblack-400" size={16} />
                   <p className="text-[8px] text-pink-200 leading-tight">Re-selection<br/>required</p>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FiVideo className="text-caribbeangreen-200 flex-shrink-0" size={16} />
                    <p className="text-richblack-5 text-sm font-medium truncate">
                      {video?.name || 'Video file'}
                    </p>
                  </div>
                  <p className="text-richblack-400 text-xs">
                    {video?.size ? `${(video.size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown size'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="ml-2 p-1.5 rounded bg-richblack-500 hover:bg-pink-700 text-richblack-300 hover:text-pink-50 transition-all"
                  title="Remove video"
                >
                  <FiX size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleClick}
                className="mt-2 text-caribbeangreen-200 hover:text-caribbeangreen-100 text-xs font-medium transition-colors"
              >
                Replace Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
