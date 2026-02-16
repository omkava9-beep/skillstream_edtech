import React from 'react'
import HighlightedText from '../commponents/core/Homepage/HighlightedText'
import aboutUs1 from '../assets/Images/aboutus1.webp'
import aboutUs2 from '../assets/Images/aboutus2.webp'    
import aboutUs3 from '../assets/Images/aboutus3.webp'    
import FoundingStory from '../assets/Images/FoundingStory.png'
import Quote from '../commponents/core/AboutPage/Quote'
import Stats from '../commponents/core/AboutPage/Stats'
import LearningGrid from '../commponents/core/AboutPage/LearningGrid'
import ContactFormSection from '../commponents/core/AboutPage/ContactFormSection'
import Footer from '../commponents/core/Homepage/Footer'

const AboutUs = () => {
  return (
    <div className='pt-16'>
      {/* section 1: Hero */}
      {/* section 1: Hero */}
      <section className="bg-richblack-900 relative isolate">
        {/* Ambient Gradient Background */}
        <div className="absolute top-0 mt-10 left-[50%] -translate-x-1/2 w-full max-w-[800px] h-[300px] sm:h-[400px] rounded-full bg-richblue-400/20 blur-[80px] sm:blur-[100px] -z-10"></div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto flex flex-col justify-between gap-10 text-center text-white pt-10 sm:pt-20">
          <header className="mx-auto py-5 font-bold lg:w-[75%] text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            Driving Innovation in Online Education for a
            <h1 className='bg-linear-to-bl text-wrap from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text tex text-transparent'>Brighter Future</h1>
            <p className="mx-auto mt-6 text-center text-base sm:text-lg font-medium text-richblack-300 lg:w-[85%] leading-relaxed">
              Studynotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          
          {/* Spacer for overlapping alignment - Increased for mobile stacking */}
          <div className="h-[300px] sm:h-[200px] lg:h-[250px]"></div>
          
          {/* Hero Images with Glow & Reflection - Absolute positioning for overlap */}
          <div className="absolute bottom-0 left-[50%] grid w-full translate-x-[-50%] translate-y-[15%] sm:translate-y-[30%] grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-[1170px] z-10 px-6 sm:px-4">
            <img src={aboutUs1} alt="" className="rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-300 ease-in-out border border-richblack-700/50 object-cover h-[120px] sm:h-auto w-full" />
            <img src={aboutUs2} alt="" className="rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-300 ease-in-out border border-richblack-700/50 backdrop-blur-sm object-cover h-[120px] sm:h-auto w-full" />
            <img src={aboutUs3} alt="" className="rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-300 ease-in-out border border-richblack-700/50 object-cover h-[120px] sm:h-auto w-full" />
          </div>
        </div>
      </section>

      {/* section 2: Quote */}
      <section className="bg-richblack-900 border-b border-richblack-800 pt-[100px] sm:pt-[150px] pb-10 sm:pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col justify-between gap-10 text-richblack-500 items-center">
            <div className="text-center text-xl sm:text-3xl md:text-4xl font-semibold opacity-90 leading-snug">
                 <Quote />
            </div>
        </div>
      </section>

      {/* section 3: Story, Vision, Mission */}
      <section className="bg-richblack-900 py-16 sm:py-32 relative overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col justify-between gap-16 sm:gap-24 text-richblack-500 text-center lg:text-left">
          
          {/* Founding Story */}
          <div className="flex flex-col items-center relative gap-10 lg:gap-16 lg:flex-row justify-between ">
             {/* Gradient Blob for Founding Story */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] opacity-20 blur-[60px] sm:blur-[90px] -z-10"></div>
            
            {/* Left Box */}
            <div className="flex lg:w-[50%] flex-col gap-6 sm:gap-8 px-2 sm:px-4">
              <h1 className="bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-3xl sm:text-4xl font-bold text-transparent lg:w-[80%] drop-shadow-sm text-center lg:text-left">
                Our Founding Story
              </h1>

              <div className="flex flex-col gap-4 sm:gap-6 text-richblack-300 text-base sm:text-lg leading-relaxed text-center lg:text-left">
                  <p>
                    Our e-learning platform was born out of a shared vision and
                    passion for transforming education. It all started with a group
                    of educators, technologists, and lifelong learners who
                    recognized the need for accessible, flexible, and high-quality
                    learning opportunities in a rapidly evolving digital world.
                  </p>
                  <p>
                    As experienced educators ourselves, we witnessed firsthand the
                    limitations and challenges of traditional education systems. We
                    believed that education should not be confined to the walls of a
                    classroom or restricted by geographical boundaries. We
                    envisioned a platform that could bridge these gaps and empower
                    individuals from all walks of life to unlock their full
                    potential.
                  </p>
              </div>
            </div>
            
            {/* Right Box - Image with Glow */}
            <div className="relative w-full max-w-[500px] lg:max-w-none">
                <img
                    className="shadow-[0_0_20px_0] sm:shadow-[0_0_40px_0] shadow-[#FC6767]/40 rounded-lg hover:rotate-1 transition-all duration-500 w-full"
                    src={FoundingStory}
                    alt="Founding Story"
                />
            </div>
          </div>

          {/* Vision and Mission */}
          <div className="flex flex-col items-center lg:gap-16 lg:flex-row justify-between relative">
            
            {/* Gradient Blob for Vision (Orange/Red) */}
            <div className="absolute top-20 left-[10%] w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] rounded-full bg-linear-to-br from-[#FF512F] to-[#F09819] opacity-20 blur-[60px] sm:blur-[100px] -z-10"></div>
             {/* Gradient Blob for Mission (Blue/Cyan) */}
            <div className="absolute bottom-20 right-[10%] w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] rounded-full bg-linear-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] opacity-20 blur-[60px] sm:blur-[100px] -z-10"></div>


            {/* Vision */}
            <div className="flex lg:w-[40%] flex-col gap-6 sm:gap-8 my-5 sm:my-10 p-6 sm:p-8 rounded-2xl bg-richblack-800/30 border border-richblack-700/50 hover:bg-richblack-800/50 transition-all duration-300 group backdrop-blur-sm z-10 w-full">
              <h1 className="bg-linear-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text text-3xl sm:text-4xl font-bold group-hover:scale-105 transition-transform duration-300 origin-left text-center lg:text-left">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 leading-relaxed text-center lg:text-left">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of experts worked tirelessly to develop an
                intuitive and interactive platform that combines cutting-edge
                technology with engaging content, fostering a dynamic and
                interactive learning experience.
              </p>
            </div>

            {/* Mission */}
            <div className="flex lg:w-[40%] flex-col gap-6 sm:gap-8 my-5 sm:my-10 p-6 sm:p-8 rounded-2xl bg-richblack-800/30 border border-richblack-700/50 hover:bg-richblack-800/50 transition-all duration-300 group backdrop-blur-sm z-10 w-full">
              <h1 className="bg-linear-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-3xl sm:text-4xl font-bold group-hover:scale-105 transition-transform duration-300 origin-left text-center lg:text-left">
                Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 leading-relaxed text-center lg:text-left">
                Our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuals can connect, collaborate, and learn from one
                another. We believe that learning thrives in an environment of
                sharing and dialogue, and we fostered this spirit through our
                platform's interactive features and forums.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* section 4 */}
      <Stats />

      {/* section 5 */}
      <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col items-center justify-between gap-5 mb-[140px]">
        <LearningGrid />
        <ContactFormSection />
      </section>

      

      <Footer />
    </div>
  );
};

export default AboutUs