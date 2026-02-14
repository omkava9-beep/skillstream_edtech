import React from 'react'

const HighlightedText = ({ text, className = "" }) => {
  return (
    <span 
      className={`
        bg-linear-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] 
        bg-clip-text text-transparent 
        font-bold
        ${className}
      `}
    >
      {text}
    </span>
  )
}

export default HighlightedText

