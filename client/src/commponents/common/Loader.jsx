import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import logo from "../../assets/Logo/Logo-Full-Light.png"

const Loader = () => {
  const loaderRef = useRef(null)
  const logoRef = useRef(null)
  const circleRef1 = useRef(null)
  const circleRef2 = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Fade In
      gsap.fromTo(
        loaderRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.inOut" }
      )

      // Spinning Circles
      gsap.to(circleRef1.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: "none",
      })

      gsap.to(circleRef2.current, {
        rotation: -360,
        duration: 1.5,
        repeat: -1,
        ease: "none",
      })

      // Pulsing Logo
      gsap.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      )
    }, loaderRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-richblack-900 bg-opacity-60 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Spinning Circle */}
        <div
          ref={circleRef1}
          className="h-32 w-32 rounded-full border-t-4 border-b-4 border-yellow-50"
        ></div>

        {/* Inner Spinning Circle */}
        <div
          ref={circleRef2}
          className="absolute h-24 w-24 rounded-full border-r-4 border-l-4 border-blue-100"
        ></div>

        {/* Logo in center */}
        <div ref={logoRef} className="absolute">
          <img src={logo} alt="Logo" className="h-8 md:h-10 object-contain" />
        </div>
      </div>
      
      <p className="mt-8 text-xl font-medium text-richblack-25 animate-pulse">
        Loading...
      </p>
    </div>
  )
}

export default Loader
