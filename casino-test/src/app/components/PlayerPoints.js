import React from "react";

function PlayerPoints({ gameState, getCardValue, socket }) {
  const totalScore =
    gameState.players
      .find((p) => p.id === socket.id) // Find the player by matching socket.id
      ?.hand.reduce((total, card) => {
        return total + getCardValue(card); // Add the card value to the total score
      }, 0) || 0;
  return (
    <div className="w-32 h-28 bg-gradient-to-t to-[#FFB96D] from-[#E27500] drop-shadow-[2px_7px_2px_#BF6709] border-2 border-[#FFB059] flex flex-col items-center rounded-xl p-2">
      <h1 className="font-black text-2xl text-[#ffffff] drop-shadow-[2px_3px_0px_#FF8400]">
        POINTS
      </h1>
      <div className="w-full bg-[#FFD3A3] h-full items-center justify-center flex rounded-lg ">
        <h1 className="font-black text-5xl text-white drop-shadow-[2px_3px_0px_#F88203] mb-2">
          {totalScore}
        </h1>
      </div>
    </div>
  );
}

export default PlayerPoints;
