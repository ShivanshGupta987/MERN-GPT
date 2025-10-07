import React from 'react'
import { TypeAnimation } from 'react-type-animation'

const TypingAnim = () => {
  return (
    <TypeAnimation
        sequence={[
            // Same substring at the start will only be typed once, initially
            'Chat With Your Own AI 🤖',
            1000,
            'Built With GEMINI PRO API',
            2000,
            'Ask Anything Related to Finance, Coding, and Cooking etc.',
            1500,
            
        ]}
        speed={50}
        style={{ fontSize: '60px', color:"white", display:"inline-block", textShadow:"1px 1px 20px #000" }}
        repeat={Infinity}
    />
  )
}

export default TypingAnim