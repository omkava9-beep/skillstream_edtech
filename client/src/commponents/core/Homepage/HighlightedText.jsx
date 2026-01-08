import React from 'react'

const HighlightedText = ({text}) => {
  return (
      <span className='font-semibold bg-linear-to-bl text-wrap from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-2xl sm:text-3xl lg:text-4xl text-transparent inline'>
         { text}
      </span>
  )
}

export default HighlightedText
