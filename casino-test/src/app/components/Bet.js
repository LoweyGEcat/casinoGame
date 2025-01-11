import React from "react";
import BubblesAnimation from "./BubblesAnimation";

function Bet({ bet }) {
  const digits = bet.toString().split("");
  return (
    <div className="relative inline-block">
      <img
        src="/image/gametablebet.svg"
        alt="Bet table"
        className="w-64 h-auto"
        style={{
          transition: "transform 0.3s ease-in-out",
        }}
      />
      <BubblesAnimation />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold flex flex-row gap-1 font-jainiPurva text-4xl mt-3 z-10">
      {digits.map((num, index) => (
        <p
         className="bg-black text-yellow-200 p-2 "
          key={index}
          style={{ left: `${(index * 30)}px` }} // Move each digit to the right by 30px for spacing
        >
          {num}
        </p>
      ))}
      </div>
    </div>
  );
}

export default Bet;
