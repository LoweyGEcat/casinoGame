import React from "react";
import Arrow from "@/app/components/Arrow";
export function Deck({ cardsLeft, onDraw, disabled }) {
  return (
    <div>
      {!disabled && <Arrow />}
      <button onClick={onDraw} disabled={disabled}>
        <div className="relative w-16 h-20 bg-gradient-to-b from-[#5ECA00] via-[#5ECA00] via-33% to-[#489A00] drop-shadow-[3px_5px_0px_#9D9D9D] border-4 rounded-lg ">
          <img
            src="/image/wcc_logo_bunot.svg"
            width={150}
            height={150}
            alt="Winner Crown"
            className="w-full h-full absolute inset-0"
          />
          <div className="absolute -left-3 -bottom-3 flex items-center justify-center">
            <h1 className="font-black text-4xl text-[#FFD653] drop-shadow-[2px_4px_0px_#9B7600]">
              {cardsLeft}
            </h1>
          </div>
        </div>
      </button>
    </div>
  );
}
