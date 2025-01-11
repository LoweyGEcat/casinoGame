import React from "react";
import Image from "next/image";
function GameRound({gameState}) {
  return (
    <div>
      <Image
        src="/image/roundBG.svg"
        width={50}
        height={50}
        alt="Winner Crown"
        className="w-28 h-28"
      />
      <div className="absolute top-10 left-left-3.2 -translate-x-1/2 -translate-y-1/2 text-white font-extrabold text-3xl  font-jaro">
        {gameState.round}
      </div>
    </div>
  );
}

export default GameRound;
