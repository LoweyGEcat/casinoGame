import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Timer from "./PlayerIconsTimer";

function PlayerIcon({
  playerIndex,
  players,
  positioning,
  currentPlayerPOV,
  ownPlayerIndex,
  currentPlayerIndex,
  timer,
}) {
  // Calculate the relative index based on the current player's POV
  const relativeIndex = React.useMemo(() => {
    const currentPlayerIndex = players.findIndex(
      (player) => player.id === currentPlayerPOV
    );
    return (playerIndex - currentPlayerIndex + players.length) % players.length;
  }, [playerIndex, players, currentPlayerPOV]);

  // Determine image URL based on relative index
  const imageUrl =
    relativeIndex === 0
      ? "https://miro.medium.com/v2/resize:fit:1400/1*rKl56ixsC55cMAsO2aQhGQ@2x.jpeg"
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVCTEOejHb2Cc4W8KxhLqz8_o5K2rO3XrfpA&s";

  const showTimer = React.useMemo(() => {
    const conditions = [
      { own: 0, target: 2 },
      { own: 0, target: 1 },
      { own: 1, target: 0 },
      { own: 1, target: 2 },
      { own: 2, target: 1 },
      { own: 2, target: 0 },
    ];
    return conditions.some(
      (cond) =>
        cond.own === ownPlayerIndex &&
        cond.target === playerIndex &&
        playerIndex === currentPlayerIndex
    );
  }, [ownPlayerIndex, playerIndex, currentPlayerIndex]);

  useEffect(() => {
    console.log(currentPlayerIndex);
  });

  return (
    <motion.div
      className={`text-2xl absolute ${positioning}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={imageUrl || "/placeholder.svg?height=64&width=64"}
              alt={`Player ${playerIndex + 1}`}
              className="relative w-28 h-28 rounded-full object-cover border-2 border-white/20"
              style={{
                transition: "transform 0.3s ease-in-out",
              }}
            />
            <div className="absolute inset-0 rounded-full border-4 border-lime-500">
              {showTimer && <Timer timer={timer} />}
            </div>
            <div
              className={`absolute ${
                ownPlayerIndex === 1 && playerIndex === 2 && "right-20"
              } ${ownPlayerIndex === 1 && playerIndex === 0 && "-right-2"} ${
                ownPlayerIndex === 0 && playerIndex === 2 && "-right-2"
              } ${ownPlayerIndex === 0 && playerIndex === 1 && "right-20"} ${
                ownPlayerIndex === 2 && playerIndex === 1 && "-right-2"
              } ${
                ownPlayerIndex === 2 && playerIndex === 0 && "right-20"
              } -bottom-2 w-12 h-14 bg-gradient-to-b from-[#5ECA00] via-[#5ECA00] via-33% to-[#489A00] border-white border-2 flex items-center justify-center rounded-lg drop-shadow-[3px_4px_0px_white]`}
            >
              <div className="relative">
                <Image
                  src="/image/wcc-logo.svg"
                  width={100}
                  height={100}
                  alt="Winner Crown"
                  className="w-full h-full relative"
                />

                <div className="absolute inset-0 flex items-center justify-center ">
                  <h1 className="font-black text-3xl text-[#FFD653] drop-shadow-[2px_4px_0px_#9B7600]">
                    {players[playerIndex]?.hand?.length || 0}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-col flex items-center">
            <h2 className="font-black text-3xl text-white my-2 drop-shadow-[2px_3px_0px_black]">
              {playerIndex}
            </h2>
            {/* PLAYER BALANCE */}
            <div className="bg-[rgba(0,0,0,0.2)] flex flex-row items-center gap-2 py-2 rounded-full px-10">
              <Image
                src="/image/potbadge.svg"
                width={50}
                height={50}
                alt="Winner Crown"
                className="w-8 h-8"
              />
              <h2 className="font-black text-xl text-[#FFD653] drop-shadow-[2px_3px_0px_black]">
                {players[playerIndex].points || 0}
              </h2>
            </div>
            {players[playerIndex].consecutiveWins > 0 && (
              <div className="flex flex-row gap-2 mt-2 items-center">
                <Image
                  src="/image/trophy.svg"
                  width={50}
                  height={50}
                  alt="Winner Crown"
                  className="w-10 h-10"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PlayerIcon;
