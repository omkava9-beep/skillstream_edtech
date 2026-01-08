import React from "react";
import YellowButton from "./YellowButton";
import DarkButton from "./DarkButton";
import HighlightedText from "./HighlightedText";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
  reverse = false,
  heading1,
  heading2,
  highlightedText,
  subheading,
  button1,
  button2,
  codeblock,
  backgroundGradient = "bg-gradient-to-br from-[#8A2BE2] via-[#FFA500] to-[#F8F8FF]",
  codeColor = "text-yellow-100",
}) => {
  return (
    <div
      className={`relative sm:flex sm:flex-row
      ${reverse ? "sm:flex-row-reverse" : "sm:flex-row"}
      gap-12 items-center justify-between
      w-full p-4 sm:px-8 lg:px-12`}
    >
      {/* LEFT SECTION */}
      <div className="flex flex-col gap-6 w-full lg:w-1/2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
          {heading1}
          <HighlightedText text={highlightedText} />
          {heading2}
        </h2>

        <p className="text-richblack-300 font-medium text-sm sm:text-base">
          {subheading}
        </p>

        <div className="flex flex-row gap-4 mb-7">
          <YellowButton>{button1}</YellowButton>
          <DarkButton>{button2}</DarkButton>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="relative w-full lg:w-1/2 flex justify-center overflow-hidden">
        <div
          className={`absolute top-24 sm:top-1/4
          w-[240px] sm:w-[360px]
          h-[160px] sm:h-[260px]
          rounded-full opacity-20 blur-[90px]
          ${backgroundGradient}`}
        />

        <div className="relative z-10 w-full max-w-[520px]
          rounded-xl bg-white/10 backdrop-blur-lg
          border border-white/10 shadow-xl shadow-black/30"
        >
          <div className="flex">
            <div className="hidden sm:flex flex-col text-richblack-300 font-bold text-center py-4 px-3 border-r border-white/10">
              {Array.from({ length: 12 }).map((_, i) => (
                <p key={i}>{i + 1}</p>
              ))}
            </div>

            <div className="relative px-4 py-4 font-mono leading-6 w-full">
              <pre className="opacity-0 select-none whitespace-pre-wrap">
                {codeblock}
              </pre>

              <div className={`absolute inset-0 ${codeColor} pt-4 pl-4`}>
                <TypeAnimation
                  sequence={[codeblock, 2500, ""]}
                  repeat={Infinity}
                  cursor
                  speed={70}
                  style={{
                    whiteSpace: "pre-line",
                    fontSize: "14px",
                    lineHeight: "22px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
