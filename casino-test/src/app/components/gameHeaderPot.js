import React, { useEffect } from "react";
import Image from "next/image";
import Bet from "./Bet";
import NetworkStatus from "./NetworkStatus";

function GameHeaderPot({ betAmout, gameState, socket }) {
  const userWinner = gameState.players.find(
    (p) => p.id === socket?.id
  )?.consecutiveWins; // Safely calculate consecutive wins

  const round = gameState.round;
  // const potMoney = gameState.potMoney
  return (
    <div className="flex flex-row items-center gap-3">
      <NetworkStatus />
      <div
        className="rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[50px] rounded-br-[50px]
shadow-lg border-2 border-[#FF7EA0]  bg-gradient-to-b from-[#911638] via-[#911638] via-33% to-[#FF1C59] items-center flex flex-row justify-around p-5 gap-2 w-full drop-shadow-[0px_4px_5px_white]"
      >
        {Array.from({ length: userWinner }).map((_, index) => (
          <div key={index}>
            <Image
              src="/image/trophy.svg"
              width={50}
              height={50}
              alt="Winner Crown"
              className="w-12 h-12"
            />
          </div>
        ))}
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/image/potbadge.svg"
            width={50}
            height={50}
            alt="Winner Crown"
            className="w-12 h-12"
          />
          <h3 className="font-jainiPurva  text-[#FFCC29] font-extrabold text-3xl drop-shadow-[2px_4px_0px_black]">
            Pot: {betAmout * 3 * round}
          </h3>
        </div>
      </div>
      <div className="flex flex-col items-start">
        <h1 className="font-medium text-white">Newbie</h1>
        <h3 className="font-medium flex-row flex gap-2 text-white">
          Amount: <span>{betAmout}</span>
        </h3>
      </div>
    </div>
  );
}

export default GameHeaderPot;
