import React, { useState, useRef } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".explore-tabs", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
        },
      });

      gsap.from(".explore-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
        },
      });
    },
    { scope: container }
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.find(
      (course) => course.tag === value
    );
    if (result) {
        setCourses(result.courses);
        setCurrentCard(result.courses[0].heading);
    }
  };

  return (
    <div className="w-full flex justify-center" ref={container}>
      <div className="w-full max-w-[1400px] px-4 sm:px-6 md:px-8 py-16 flex flex-col items-center gap-12 ">

        {/* ================= TABS ================= */}
        <div className="w-full flex md:justify-center overflow-x-auto no-scrollbar explore-tabs">
          <div className="flex flex-row gap-3 bg-richblack-800 border border-richblack-700 rounded-full p-2">
            {tabsName.map((element, index) => (
              <button
                key={index}
                onClick={() => setMyCards(element)}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200
                  ${
                    currentTab === element
                      ? "bg-yellow-400 text-richblack-900 font-bold shadow-md scale-105"
                      : "text-richblack-200 hover:bg-richblack-700"
                  }`}
              >
                {element}
              </button>
            ))}
          </div>
        </div>

        {/* ================= COURSE CARDS ================= */}
        <div className="w-full max-w-[1300px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-14 px-4">
            {courses.map((element, index) => (
              <div key={index} className="explore-card flex justify-center">
                <CourseCard
                  cardData={element}
                  currentCard={currentCard}
                  setCurrentCard={setCurrentCard}
                />
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default ExploreMore;
