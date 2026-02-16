import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import ReviewCard from "../commponents/core/Homepage/ReviewCard";
import Footer from "../commponents/core/Homepage/Footer";
import ExploreMore from "../commponents/core/Homepage/Exploremore";
import { getAllRatings } from "../services/operations/courseAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const container = useRef();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getAllRatings();
      if (data) {
        setReviews(data);
      }
    };
    fetchReviews();
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".hero-element", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(".video-banner", {
        scale: 0.8,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".video-banner",
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        },
      });

      gsap.from(".instructor-img", {
        x: -50,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".instructor-section",
          start: "top 80%",
        },
      });

      gsap.from(".instructor-text", {
        x: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".instructor-section",
          start: "top 80%",
        },
      });

      gsap.from(".review-section-heading", {
        y: 30,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".review-section",
          start: "top 85%",
        },
      });
    },
    { scope: container }
  );

  return (
    <div className="w-full pt-28 sm:pt-36 lg:pt-44 overflow-x-hidden" ref={container}>
      <div className="flex flex-col w-full font-inter">
        <div className="relative flex flex-col items-center gap-10 sm:gap-16 px-4 sm:px-6 lg:px-12 xl:px-20 z-10">
          
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow-100/10 blur-[120px] rounded-full -z-10"></div>
          <div className="absolute top-[20%] right-[-5%] w-[350px] h-[350px] bg-blue-200/5 blur-[100px] rounded-full -z-10"></div>

          <Link to="/signup" className="hero-element mt-4 sm:mt-8">
            <div className="flex items-center gap-2 px-6 h-11 text-richblack-200 bg-richblack-900/60 backdrop-blur-md rounded-full hover:bg-richblack-800 transition-all duration-300 border border-white/10 shadow-lg">
              <span className="text-[16px] font-inter">Become an Instructor</span>
              <FaArrowRight />
            </div>
          </Link>

          <div className="flex flex-col items-center gap-6 max-w-[950px] text-center hero-element">
            <h1 className="leading-[1.1] sm:leading-tight">
              <span className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-linear-to-b from-richblack-5 to-richblack-400 bg-clip-text text-transparent">
                Empower Your Future with
              </span>
              <br />
              <HighlightedText text="Coding Skills" className="text-4xl sm:text-5xl lg:text-7xl" />
            </h1>

            <p className="text-richblack-300 text-base sm:text-lg lg:text-xl max-w-[850px] leading-relaxed">
              With our online coding courses, you can learn at your own pace,
              from anywhere in the world, and get access to hands-on projects,
              quizzes, and personalized feedback from instructors.
            </p>
          </div>

          <div className="flex flex-row items-center gap-4 hero-element">
            <YellowButton linkto="/signup">Learn more</YellowButton>
            <DarkButton linkto="/contact">Book a Demo</DarkButton>
          </div>

          <div className="mb-20 rounded-2xl backdrop-blur-lg bg-white/5 p-2 sm:p-4 video-banner ring-1 ring-white/10">
            <video
              src={Banner}
              muted
              loop
              autoPlay
              className="rounded-xl shadow-[0_0_50px_rgba(8,145,178,0.3)] w-full max-w-[1250px]"
            />
          </div>
        </div>

        <div className="flex flex-col items-center px-4 sm:px-8 lg:px-20 gap-24 py-20 relative">
          <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-pink-500/5 blur-[150px] rounded-full -z-10"></div>
          <div className="absolute bottom-[10%] left-0 w-[500px] h-[500px] bg-richblue-500/5 blur-[150px] rounded-full -z-10"></div>

          <CodeBlocks
            reverse={false}
            heading1="Unlock your "
            heading2=" with our online courses"
            highlightedText=" coding potential"
            codeColor="text-yellow-100"
            subheading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            button1="Try it Yourself"
            button2="Learn more"
            linkto1="/signup"
            linkto2="/signup"
            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<link rel="stylesheet" href="style.css">\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="one/">One</a>\n<a href="two/">Two</a>\n<a href="three/">Three</a></nav>`}
          />

          <CodeBlocks
            reverse={true}
            heading1="Start "
            heading2=""
            codeColor="text-white"
            highlightedText=" Coding in seconds"
            subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            button1="Continue Lesson"
            button2="Learn more"
            linkto1="/signup"
            linkto2="/signup"
            codeblock={`import React from "react";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst App = () => {\n  return (\n    <div>Hello World</div>\n  );\n};\nexport default App;`}
          />
          
          <ExploreMore />
        </div> 
      </div>

      <div className="w-full bg-pure-greys-5 mt-32">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 relative">
          <div className="homepage_bg h-[333px] w-full rounded-xl flex items-center top-4 justify-center">
            <div className="w-11/12 max-w-max flex flex-col items-center gap-5 mx-auto sm:flex-row">
              <YellowButton linkto="/catalog/all-courses">Explore Full Catalog</YellowButton>
              <DarkButton linkto="/signup">Learn more</DarkButton>
            </div>
          </div>
        </div>

        <div className="w-full bg-pure-greys-5 mt-20">
          <div className="flex flex-col items-center gap-20">
            <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col md:flex-row gap-10 items-center">
              <div className="lg:w-1/2">
                <h1 className="text-2xl md:text-[36px] font-semibold text-richblack-900 leading-tight">
                  Get the Skills you need for a{" "}
                </h1>
                <HighlightedText text="Job that is in demand." className="text-4xl" />
              </div>
              <div className="lg:w-1/2 flex flex-col gap-6 justify-center">
                <p className="text-[16px] text-richblack-700 leading-relaxed">
                  The modern StudyNotion dictates its own terms. Today, to be a competitive
                  specialist requires more than professional skills.
                </p>
                <div>
                  <YellowButton linkto="/catalog/all-courses">Explore Courses</YellowButton>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col md:flex-row lg:flex-row gap-10 items-center">
              <div className="relative flex flex-col gap-8 sm:gap-10 w-full lg:w-1/2 pl-6 sm:pl-8 mb-5">
                <div className="absolute left-2 sm:left-3 top-0 h-full w-[2px] bg-richblack-200"></div>
                <Timeline logo={Logo1} heading="Leadership" subheading="Fully committed to the success company" />
                <Timeline logo={Logo2} heading="Responsibility" subheading="Students will always be our top priority" />
                <Timeline logo={Logo3} heading="Flexibility" subheading="The ability to switch is an important skill" />
                <Timeline logo={Logo4} heading="Solve the problem" subheading="Code your way to a solution" />
              </div>

              <div className="w-full lg:w-1/2 relative flex justify-center font-inter">
                <img src={TimelineImage} alt="Timeline" className="w-full max-w-[500px] sm:max-w-[600px] lg:max-w-full object-contain m-2" />
                <div className="absolute -bottom-10 sm:-bottom-11 left-1/2 -translate-x-1/2 bg-caribbeangreen-600 text-white flex flex-col sm:flex-row gap-6 sm:gap-10 px-6 sm:px-10 py-4 sm:py-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl sm:text-3xl font-bold">10</h1>
                    <div className="text-xs sm:text-sm leading-tight text-caribbeangreen-300">
                      <p>YEARS</p><p>EXPERIENCE</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl sm:text-3xl font-bold">250</h1>
                    <div className="text-xs sm:text-sm leading-tight text-caribbeangreen-300">
                      <p>TYPES OF</p><p>COURSES</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LearningLanguageSection img1={img1} img2={img2} img3={img3} linkto="/signup" />
      </div>

      <div className="bg-richblack-900">
        <div className="relative w-full py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 instructor-section max-w-7xl mx-auto">
            <div className="relative instructor-img shrink-0">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-yellow-100/50 -z-10 rounded-2xl hidden lg:block translate-x-4 translate-y-4"></div>
              <img src={instructor} alt="Instructor" className="w-72 sm:w-80 lg:w-[450px] shadow-[20px_20px_0_0] shadow-white rounded-2xl" />
            </div>
            <div className="flex flex-col gap-8 text-center lg:text-left instructor-text">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Become an <br className="hidden lg:block"/><HighlightedText text="Instructor" />
                </h2>
                <div className="h-1 w-20 bg-yellow-100 rounded-full mx-auto lg:mx-0 mt-2"></div>
              </div>
              <p className="font-medium text-lg leading-relaxed text-richblack-300 max-w-[600px]">
                Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
              </p>
              <div className="w-fit mx-auto lg:mx-0">
                <YellowButton linkto="/signup">Start Teaching Today</YellowButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-richblack-900 px-4 py-10 sm:px-6 lg:px-12 flex flex-col items-center gap-8 review-section">
        <h2 className="text-richblack-25 text-2xl sm:text-3xl lg:text-[36px] font-medium text-center review-section-heading">
          Review from other Learners
        </h2>
        <div className="w-full max-w-7xl">
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            freeMode={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            modules={[FreeMode, Pagination, Autoplay]}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 } }}
            className="w-full h-full py-8"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <ReviewCard
                  name={`${review?.user?.firstName} ${review?.user?.lastName}`}
                  email={review?.user?.email}
                  avatar={review?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                  review={review?.review}
                  rating={review?.rating}
                  courseName={review?.course?.courseName}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;