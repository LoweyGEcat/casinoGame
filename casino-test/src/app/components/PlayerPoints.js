import React from 'react'

function PlayerPoints({gameState,getCardValue,socket}) {
  const totalScore = gameState.players
  .find(p => p.id === socket.id)  // Find the player by matching socket.id
  ?.hand.reduce((total, card) => {
    return total + getCardValue(card); // Add the card value to the total score
  }, 0) || 0;
  return (
    <div className="absolute right-0 p-5 flex flex-col justify-center gap-2 items-center ">
    <div className="rounded-full p-2 text-2xl bg-[url('/image/pointsBG.svg')] bg-no-repeat bg-cover bg-center flex items-center justify-center border-2 border-black font-extrabold w-16 h-16">{totalScore}</div>
    <h4 className="text-white font-bold text-2xl">Points</h4>
  </div>
  )
}

export default PlayerPoints
