import React from 'react'
import HighlightedText from './HighlightedText'
import YellowButton from './YellowButton'


const LearningLanguageSection = ({img1, img2 , img3}) => {
  return (
    <div className=' flex flex-col items-center bg-pure-greys-5 gap-[52px]'>
        <div className="w-11/12 text-richblack-900 font-inter  flex flex-col items-center mt-28">
            <h1 className=' text-[36px] font-semibold leading-11 tracking-[-2%]'>Your swiss knife for <HighlightedText text="learning any language"></HighlightedText></h1>
            <p className=' ring-richblack-700 text-[16px] leading-6 max-w-190 text-center font-medium'>Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.</p>
        </div>
        <div className='relative flex w-full bg-pure-greys-5 items-center justify-center'>
            <img src={img1} alt="" className='absolute left-[300px] ' />
            <img src={img3} alt="" className='left-[580px] -z-0'/>
            <img src={img2} alt="" className='absolute right-[280px]'/>
        </div>
        <div className=' h-36 flex flex-col items-center justify-center'>
            <YellowButton>Learn more</YellowButton>
            
        </div>
    </div>
  )
}

export default LearningLanguageSection
