import React from "react";
import { Link } from "react-router-dom";
import HighlightedText from "../commponents/core/Homepage/HighlightedText";
import { FaArrowRight } from "react-icons/fa";
import YellowButton from "../commponents/core/Homepage/YellowButton";
import DarkButton from "../commponents/core/Homepage/DarkButton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../commponents/core/Homepage/CodeBlocks";
import bghome from '../assets/Images/bghome.svg'
import "../index.css";
import Logo1 from '../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../assets/TimeLineLogo/Logo4.svg'
import Timeline from "../commponents/core/Homepage/Timeline";
import TimelineImage from "../assets/Images/TimelineImage.png"
import LearningLanguageSection from "../commponents/core/Homepage/LearningLanguageSection";
import img1 from '../assets/Images/Know_your_progress.svg'
import img2 from '../assets/Images/Plan_your_lessons.svg'
import img3 from '../assets/Images/Compare_with_others.svg'
import instructor from '../assets/Images/Instructor.png'
import ExploreMore from "../commponents/core/Homepage/Exploremore";
import ReviewCard from "../commponents/core/Homepage/ReviewCard";

const Home = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto font-inter">
        <div className="flex flex-col items-center gap-12 px-1.5">

          <Link to="/signup">
            <div
              className="mt-12 flex items-center gap-2 px-6 h-11
              text-richblack-200 bg-richblack-800 rounded-full
              hover:bg-richblack-700 transition-all duration-300 border-b"
            >
              <span className="text-[16px] font-inter">
                Become an Instructor
              </span>
              <FaArrowRight />
            </div>
          </Link>
          {/* Heading */}
          <div className="flex flex-col items-center gap-6 max-w-[850px] text-center">
            <h1 className="gap-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-medium ">Empower Your Future with</span>
              <HighlightedText text=" Coding Skills" />
            </h1>

            <p className="text-richblack-200 text-[16px]">
              With our online coding courses, you can learn at your own pace,
              from anywhere in the world, and get access to hands-on projects,
              quizzes, and personalized feedback from instructors.
            </p>
          </div>
          <div className="flex md:flex-row gap-4">
            <YellowButton>Learn more</YellowButton>
            <DarkButton>Book a Demo</DarkButton>
          </div>
          <div className="mb-20 rounded-2xl backdrop-blur-lg bg-white/10 px-2 m-3.5">
            <video
              src={Banner}
              muted
              loop
              autoPlay
              className="rounded-2xl shadow-2xl shadow-richblue-500/50 w-[1250px]"
            />
          </div>
        </div>

        <div className="flex flex-col items-center px-2">
            <CodeBlocks
            reverse={false}
            heading1="Unlock your "
            heading2=" with our online courses"
            highlightedText = " coding potential"
            codeColor="font-semibold bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent"
            subheading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            button1="Try it Yourself"
            button2="Learn more"
            codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
          />
          <CodeBlocks
            reverse={true}
            heading1="Start "
            heading2=""
            codeColor="font-semibold bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent"
            highlightedText = " Coding in seconds"
            subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            button1="Continue Lesson"
            button2="Learn more"
            codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
          />
          
          <ExploreMore></ExploreMore>
            

          
        </div> 
        
      </div>
      {/* section2 */}
      <div className=" w-full bg-pure-greys-5 mt-32 ">
          {/* part1 */}
          
          <div className="mx-auto px-4 relative">
            
            <div className="homepage_bg h-[333px] w-full rounded-xl flex items-center top-4 justify-center">
              
              <div className="w-11/12 max-w-max flex flex-col items-center gap-5 mx-auto sm:flex-row">
                <YellowButton>Explore Full Catalog</YellowButton>
                <DarkButton>Learn more</DarkButton>
              </div>
            </div>
          </div>
          {/* part-2 */}
          <div className="w-full bg-pure-greys-5 mt-20">
            <div className="flex flex-col gap-20">

              {/* ===== TEXT ROW (same alignment as part-1) ===== */}
              <div className="max-w-[1280px] mx-auto px-4 gap-12 items-start md:flex md:flex-row ">
                
                {/* Left */}
                <div className="lg:w-1/2">
                  <h1 className="text-2xl md:text-[36px] font-semibold text-richblack-900 leading-tight">
                    Get the Skills you need for a{" "}
                  </h1>
                  <HighlightedText text="Job that is in demand." />
                </div>

                {/* Right */}
                <div className="lg:w-1/2 flex flex-col gap-6 justify-center">
                  <p className="text-[16px] text-richblack-700 leading-relaxed">
                    The modern StudyNotion dictates its own terms. Today, to be a competitive
                    specialist requires more than professional skills.
                  </p>

                  <div>
                    <YellowButton>Explore Courses</YellowButton>
                  </div>
                </div>
              </div>

              {/* ===== TIMELINE + IMAGE ROW ===== */}
              <div className="max-w-[1280px] mx-auto px-4 flex lg:flex-row gap-[52px] items-center">

                {/* ===== Timeline ===== */}
                <div className="relative flex flex-col gap-10 lg:w-1/2 pl-8">

                  {/* Vertical line */}
                  <div className="absolute left-3 top-0 h-full w-[2px] bg-richblack-200"></div>

                  <Timeline
                    logo={Logo1}
                    heading="Leadership"
                    subheading="Fully committed to the success company"
                  />
                  <Timeline
                    logo={Logo2}
                    heading="Responsibility"
                    subheading="Students will always be our top priority"
                  />
                  <Timeline
                    logo={Logo3}
                    heading="Flexibility"
                    subheading="The ability to switch is an important skill"
                  />
                  <Timeline
                    logo={Logo4}
                    heading="Solve the problem"
                    subheading="Code your way to a solution"
                  />
                </div>

                {/* ===== Image + Stats ===== */}
                <div className="lg:w-1/2 relative flex justify-center font-inter">

                  {/* Image */}
                  <img
                    src={TimelineImage}
                    alt="Timeline Illustration"
                    className="w-full h-136.25 object-contain"
                  />

                  {/* Stats Card */}
                  <div className="
                    absolute bottom-1.75 left-1/2 -translate-x-1/2
                    bg-caribbeangreen-600 text-white
                    flex gap-13 px-10 py-6
                    shadow-lg
                  ">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold">10</h1>
                      <div className="text-sm leading-tight text-caribbeangreen-300">
                        <p>YEARS</p>
                        <p>EXPERIENCE</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold">250</h1>
                      <div className="text-sm leading-tight  text-caribbeangreen-300">
                        <p>TYPES OF</p>
                        <p>COURSES</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
          {/* part-3 */}
          <LearningLanguageSection img1={img1} img2={img2} img3={img3}></LearningLanguageSection>
      </div>
      {/* section3 */}
      <div className=" bg-richblack-900 ">
        {/* part-1  */}
        <div className="flex py-[90px] px-[120px] relative gap-[98px]">
          <div className=" min-w-[616px] h-[545px] bg-richblack-25">

          </div>
          <div className="absolute left-[140px] top-[110px] ">
              <img src={instructor} alt=""/>
          </div>
          <div className=" flex flex-col items-start gap-[12px] justify-center max-w-171.5">
            <h2 className=" text-[36px] font-semibold leading-[44px] tracking-[-2%]">
              <p>Become an</p>
              <HighlightedText text="Instructor"></HighlightedText>
            </h2>
            <p className=" font-medium text-[16px] leading-[24px] text-richblack-300 mb-7">Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
            <YellowButton >Start Teaching Today</YellowButton>
            
          </div>
        </div>
        {/* part-2 */}
        <div className="p-5 bg-richblack-900 flex flex-col justify-center gap-5 items-center">
          <h2 className=" text-richblack-25 text-[36px] font-medium mb-8">Review from other Learners</h2>
          <div className=" flex gap-7 ">

            <ReviewCard 
              name="Cody Fisher"
              email="tim.jennings@example.com"
              avatar="https://i.pravatar.cc/150?u=cody"
              review="Coordination of activities improved tremendously with Learn codings."
              rating={4.5}
            />
            <ReviewCard 
              name="Cody Fisher"
              email="tim.jennings@example.com"
              avatar="https://i.pravatar.cc/150?u=cody"
              review="Coordination of activities improved tremendously with Learn codings."
              rating={4.5}
            />
            <ReviewCard 
              name="Cody Fisher"
              email="tim.jennings@example.com"
              avatar="https://i.pravatar.cc/150?u=cody"
              review="Coordination of activities improved tremendously with Learn codings."
              rating={4.5}
            />
            <ReviewCard 
              name="Cody Fisher"
              email="tim.jennings@example.com"
              avatar="https://i.pravatar.cc/150?u=cody"
              review="Coordination of activities improved tremendously with Learn codings."
              rating={4.5}
            />
          </div>
        </div>
          </div>


        {/* footer */}
        
    </div>
  );
};

export default Home;
