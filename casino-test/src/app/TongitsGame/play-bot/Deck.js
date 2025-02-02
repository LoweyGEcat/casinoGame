import React from "react";
import Arrow from "@/app/components/Arrow";
export function Deck({ cardsLeft, onDraw, disabled }) {
  return (
    <div>
      {!disabled && <Arrow />}
      <button
        className="w-1.5 2xl:w-24 h-24 2xl:h-28 bg-[url('/image/cardBackground.svg')]  bg-no-repeat bg-cover bg-center rounded-lg shadow-md flex items-center justify-center flex-col"
        onClick={onDraw}
        disabled={disabled}
      >
        <span
          className="text-white text-stroke-thin font-bold font-jaro text-4xl flex flex-col"
          style={{
            textShadow: "2px 2px 4px rgba(255, 255, 255, 0.8)",
          }}
        >
          {cardsLeft} 
        </span>
      </button>
    </div>
  );
}
