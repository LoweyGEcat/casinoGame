import React, { useEffect } from "react";
import Image from "next/image";
import Bet from "./Bet";

function GameHeaderPot({betAmout, gameState,socket }) {
  const userWinner = gameState.players
  .find(p => p.id === socket?.id)?.consecutiveWins;  // Safely calculate consecutive wins

  const round = gameState.round;
  // const potMoney = gameState.potMoney
  return (
    <div className="relative">
      <Image
        src="/image/headerGame.svg"
        width={1000}
        height={1000}
        alt="My image"
        className="w-auto h-36 2xl:h-40"
        style={{
          transition: "transform 0.3s ease-in-out",
        }}
      />
      <div className="absolute top-5 left-40 transform -translate-x-1/2 ">
        <div className="flex flex-row-reverse gap-3  w-48">
          {Array.from({ length: userWinner }).map((_, index) => (
            <div key={index}>
              <Image
                src="/image/winnerCrown.svg"
                width={50}
                height={50}
                alt="Winner Crown"
                className="w-12 h-12"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-4 -right-4 transform -translate-x-1/2  w-48 flex flex-col gap-0">
        <h3
          className="font-jainiPurva  text-yellow-300 font-extrabold text-2xl"

        >
          Bet Amuont: {betAmout}
        </h3>
        <h3
          className="font-jainiPurva  text-yellow-300 font-extrabold text-2xl"
        >
          Pot: {betAmout * 3 * round}
        </h3>
      </div>
    </div>
  );
}

export default GameHeaderPot;
