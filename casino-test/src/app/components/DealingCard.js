"use client"

import { useRef, useEffect, useState } from "react"
import { Volume2, VolumeX } from 'lucide-react'
import gsap from "gsap"

export default function DealingAnimation({ onComplete }) {
  const containerRef = useRef(null)
  const audioRef = useRef(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [isAudioInitialized, setIsAudioInitialized] = useState(false)

  // Initialize audio context
  useEffect(() => {
    audioRef.current = new Audio('/audio/dealingCard.mp3') 
    audioRef.current.volume = 0.5
  }, [])

  // Handle audio initialization
  const initializeAudio = async () => {
    if (audioRef.current && !isAudioInitialized) {
      try {
        await audioRef.current.play()
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsAudioEnabled(true)
        setIsAudioInitialized(true)
      } catch (error) {
        console.log('Audio initialization failed:', error)
      }
    }
  }

  const toggleAudio = async () => {
    if (!isAudioInitialized) {
      await initializeAudio()
    } else {
      setIsAudioEnabled(!isAudioEnabled)
    }
  }
  
  useEffect(() => {
    const cards = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      position: Math.floor(i / 12)
    }))
    
    const cardElements = cards.map(card => {
      const div = document.createElement('div')
      div.className = 'absolute w-14 h-20 bg-white rounded-lg border border-black shadow-md'
      div.innerHTML = '<div class="absolute inset-1 bg-[url(/image/cardBackground.svg)]  bg-no-repeat bg-cover bg-center rounded"></div>'
      div.style.left = '50%'
      div.style.top = '30%'
      div.style.transform = 'translate(-50%, -50%)'
      containerRef.current?.appendChild(div)
      return div
    })

    const playCardSound = () => {
      if (audioRef.current && isAudioEnabled && isAudioInitialized) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(error => {
          console.log('Audio playback failed:', error)
        })
      }
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 600)
      }
    })

    tl.to(cardElements, {
      duration: 0.5,
      y: (i) => {
        const position = Math.floor(i / 12)
        return position === 1 ? 310 : 80
      },
      x: (i) => {
        const position = Math.floor(i / 12)
        return position === 0 ? -420 : position === 2 ? 420 : 0
      },
      rotation: () => gsap.utils.random(-5, 5),
      ease: "power3.out",
      stagger: {
        each: 0.01,
        from: "center",
        onStart: playCardSound
      }
    })
    .to(cardElements, {
      duration: 1,
      opacity: 0,
      delay: 0.2,
      stagger: 0.01,
    }, "+=0.5")

    return () => {
      tl.kill()
      cardElements.forEach(card => card.remove())
      audioRef.current.pause()
    }
  }, [onComplete, isAudioEnabled, isAudioInitialized])

  return (
    <div className="fixed inset-0" ref={containerRef}>
      {/* Sound toggle button */}
      <button
        onClick={toggleAudio}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label={isAudioEnabled ? "Disable sound" : "Enable sound"}
      >
        {isAudioEnabled ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </button>

      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-14 2xl:w-24 h-20 2xl:h-28 bg-[url(/image/cardBackground.svg)] bg-no-repeat bg-cover bg-center rounded-lg shadow-xl" />
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
        <path
          d="M 50% 50% Q 25% 30% 20% 80%"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M 50% 50% Q 50% 30% 50% 80%"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M 50% 50% Q 75% 30% 80% 80%"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  )
}

