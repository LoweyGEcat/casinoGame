import {React,useRef, useEffect, useState} from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Player } from '../../../hooks/use-tongit-game';
import { Card as CardType } from '../../../utils/card-utils';

export function Card({position, border,transformCard,id ,opacityCard, cardSize, card, onClick, small = false,isDiscarding}) {
  const { suit, rank } = card;
  const boxRef = useRef(null)
  const [isPosition, setIsPosition] = useState()
    // Animation controls for the card
    const controls = useAnimation();
  const color = suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black';

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.style.transform = transformCard ? transformCard : " ";
      boxRef.current.style.border = border ? border : ''; 
    }
  }, [transformCard,border])
    // Effect to trigger discard animation
    useEffect(() => {
      if (isDiscarding) {
        const rect = boxRef.current.getBoundingClientRect();
        setIsPosition(rect.x)
        controls.start({
          x: `calc(${position.x}px - ${rect.x}px)`, 
          y:  -340, // Upward movement
          rotate: 360,
          scale: [1, 1, 0.8], 
          // opacity: [1, 0], // Fade out Transition
          transition: { duration: 0.3, ease: "easeIn" }
        });
      }
    }, [isDiscarding, controls,position]);

  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };
  const baseClasses = `${opacityCard} bg-white border border-gray-300 rounded-md shadow-sm flex flex-col justify-between cursor-pointer ${color}`;

  // Make the card bigger by adjusting width, height, and padding
  const sizeClasses = small 
  ? `${cardSize}` // smaller size
  : `${cardSize}`; // bigger size


  return (
    <motion.div 
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={controls}
  >   <div 
  id={`card-${id}`}
    className={`${baseClasses} ${sizeClasses}`}
    onClick={onClick}
    ref={boxRef} 
  >
    <div className="text-left font-bold text-2xl">{rank}</div>
    <div className="text-center text-4xl 2xl:text-4xl">
      {getSuitSymbol(suit)}
    </div>
  </div></motion.div> 

  );
}
