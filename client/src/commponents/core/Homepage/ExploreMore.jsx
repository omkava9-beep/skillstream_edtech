import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skill paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.find(
      (course) => course.tag === value
    );
    setCourses(result.courses);
    setCurrentCard(result.courses[0].heading);
  };

  return (
    <div className="w-full flex ">
      <div className="w-full max-w-[1280px] px-4 sm:px-6 md:px-8 py-16 flex flex-col items-center gap-12">

        {/* ================= TABS ================= */}
        <div className="w-full flex overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 bg-richblack-800 border border-richblack-700 rounded-full p-2">
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
        <div className="w-full max-w-6xl">
          <div
          className="
            sm:grid-cols-2
            gap-6
            sm:md:grid
            sm:md:grid-cols-2
            lg:grid-cols-3
            lg:pb-4
             lg:mx-2
          "
        >

            {courses.map((element, index) => (
              <div key={index} className="lg:min-w-[320px] m-8">
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
