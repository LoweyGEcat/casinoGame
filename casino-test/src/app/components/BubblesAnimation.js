"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"



export default function BubblesAnimation() {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [bubbles, setBubbles] = useState([])

  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.bubble-container') 
      if (container) {
        setContainerSize({
          width: container.offsetWidth,
          height: container.offsetHeight
        })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 4, // Random size between 4 and 12 pixels
      speed: Math.random() * 20 + 2, // Random speed between 2 and 6 seconds
      delay: Math.random() * -1, // Random delay start, negative to stagger
      yPosition: Math.random() * 100, // Random y position (0-100%)
    }))
    setBubbles(newBubbles)

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bubble-container" aria-hidden="true">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-white"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: `${bubble.yPosition}%`,
            opacity: 0.6,
            left: "-5%", // Start slightly off-screen
          }}
          animate={{
            left: "105%", // Move to slightly off-screen right
          }}
          transition={{
            duration: bubble.speed,
            repeat: Infinity,
            ease: "linear",
            delay: bubble.delay,
          }}
        />
      ))}
    </div>
  )
}

