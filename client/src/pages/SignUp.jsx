import React from 'react'
import signupImg from '../assets/Images/signup.webp'
import Template from '../commponents/auth/Template'
const SignUp = () => {
  return (
    <div>
      <Template
            title="Join the millions learning to code with SkillStream for free"
            des1="Build skills for today, tomorrow, and beyond."
            des2="Education to future-proof your career."
            imgmain={signupImg}
            formtype="signup"
            />
    </div>
  )
}

export default SignUp
