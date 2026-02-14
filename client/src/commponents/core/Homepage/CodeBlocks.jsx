import React, { useRef } from "react";
import YellowButton from "./YellowButton";
import DarkButton from "./DarkButton";
import HighlightedText from "./HighlightedText";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CodeBlocks = ({
  reverse = false,
  heading1,
  heading2,
  highlightedText,
  subheading,
  button1,
  button2,
  linkto1,
  linkto2,
  codeblock,
  backgroundGradient = "bg-gradient-to-br from-[#8A2BE2] via-[#FFA500] to-[#F8F8FF]",
  codeColor = "text-yellow-100",
}) => {
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".code-blocks-text", {
        x: reverse ? 100 : -100,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      });

      gsap.from(".code-blocks-preview", {
        x: reverse ? -100 : 100,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className={`relative sm:flex sm:flex-row
      ${reverse ? "sm:flex-row-reverse" : "sm:flex-row"}
      gap-12 items-center justify-between
      w-full p-4 sm:px-8 lg:px-12`}
    >
      {/* LEFT SECTION */}
      <div className="flex flex-col gap-6 w-full lg:w-1/2 code-blocks-text">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
          {heading1}
          <HighlightedText text={highlightedText} />
          {heading2}
        </h2>

        <p className="text-richblack-300 font-medium text-sm sm:text-base">
          {subheading}
        </p>

        <div className="flex flex-row gap-4 mb-7">
          <YellowButton linkto={linkto1}>{button1}</YellowButton>
          <DarkButton linkto={linkto2}>{button2}</DarkButton>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="relative w-full lg:w-1/2 flex justify-center overflow-hidden code-blocks-preview">
        <div
          className={`absolute top-24 sm:top-1/4
          w-[240px] sm:w-[360px]
          h-[160px] sm:h-[260px]
          rounded-full opacity-20 blur-[90px]
          ${backgroundGradient}`}
        />

        <div className="relative z-10 w-full max-w-[520px]
          rounded-xl bg-richblack-900/40 backdrop-blur-xl
          border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Window Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-pink-500/80 shadow-[0_0_8px_rgba(236,72,153,0.4)]"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.4)]"></div>
            <div className="w-3 h-3 rounded-full bg-caribbeangreen-200/80 shadow-[0_0_8px_rgba(5,255,191,0.4)]"></div>
          </div>

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
