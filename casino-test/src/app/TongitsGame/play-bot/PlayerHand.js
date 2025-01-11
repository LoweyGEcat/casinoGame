import React from "react";
import { Card } from "./Card";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap';

export function PlayerHand({
  position,
  cardSize,
  hand,
  onCardClick,
  selectedIndices,
  isCurrentPlayer,
  discardingIndex
}) {
  const containerRef = useRef(null);
  const [selectedCards, setSelectedCards] = useState(new Set())
  const animationTriggered = useRef(false);

  // Reset selected cards when selectedIndices changes
  useEffect(() => {
    setSelectedCards(new Set(selectedIndices));
  }, [selectedIndices]);

  useEffect(() => {
    if (!animationTriggered.current && containerRef.current && hand?.length > 0) {
      const cards = containerRef.current.children;
      gsap.set(cards, {
        x: 3,
        y: 0,
        opacity: 0,
      });

      gsap.to(cards, {
        x: (index) => index * -45,
        opacity: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.out',
      });

      animationTriggered.current = true;
    }
  }, [hand]);

  const handleCardClick = (index) => {
    if (isCurrentPlayer) {
      onCardClick(index);
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap justify-center p-4 rounded-lg relative ${
        isCurrentPlayer ? "bg-opacity-10 shadow-lg h-60 w-[66rem] 2xl:w-[75rem] " : "bg-opacity-10 shadow-lg h-60 w-[66rem] 2xl:w-[75rem]"
      }`}
    >
      {hand?.map((card, index) => (
        <motion.div
          key={`${card.suit}-${card.rank}-${index}`}
          layout
          initial={false}
          animate={{
            y: selectedIndices.includes(index) ? -16 : 0,
            x: index * -45,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ rotate: 5 }}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'perspective(1000px)',
            borderRadius: "0.5rem",
            bottom: "10px",
            right: "10px",
            position: "absolute",
            zIndex: hand.length - index,
          }}
        >
          <Card
          border={'1px solid black'}
            position={position}
            opacityCard={`${selectedCards.size === 0 || selectedCards.has(index) ? 'opacity-100' : 'opacity-85'}`}
            cardSize={cardSize}
            card={card}
            onClick={() => handleCardClick(index)}
            isDiscarding={discardingIndex === index}
          />
        </motion.div>
      ))}
      {isCurrentPlayer && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
            Your Turn!
          </div>
        </div>
      )}
    </div>
  );
}

