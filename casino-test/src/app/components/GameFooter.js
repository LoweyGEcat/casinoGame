/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import PlayerPoints from "@/app/components/PlayerPoints";
import { calculateCardPoints } from "@/utils/card-utils";

const GameFooter = ({
  onMeld,
  onDiscard,
  onSapaw,
  onFight,
  isPlayerTurn,
  selectedCard,
  gameEnded,
  hasDrawnThisTurn,
  selectedIndices,
  selectedSapawTarget,
  onAutoSort,
  onShuffle,
  enableFight,
  isCurrentPlayerSapawTarget,
  isSapawed,
  drawnCard,
  socket,
  gameState,
}) => {
  const [scale, setScale] = React.useState(1);

  const animateClick = () => {
    setScale(0.99);
    setTimeout(() => setScale(1), 300);
  };

  return (
    <div className="flex w-screen items-center pt-7 h-32 absolute bottom-40 left-0 justify-center">
      <div className="flex flex-row items-center gap-3">
        <button
          onClick={onMeld}
          disabled={
            !isPlayerTurn &&
            (!selectedCard ||
              selectedIndices.length === 0 ||
              !hasDrawnThisTurn ||
              gameEnded)
          }
          className="bg-green-500 p-2 rounded-full w-32  bg-gradient-to-t to-[#6BFF8B] from-[#00C22A] drop-shadow-[2px_7px_2px_#1E8E36] border-2 border-[#60FF82]"
        >
          <span
            onClick={animateClick}
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity:
                !isPlayerTurn ||
                !selectedCard ||
                selectedIndices.length === 0 ||
                !hasDrawnThisTurn ||
                gameEnded
                  ? 0.5
                  : 1,
            }}
            className="font-black text-xl drop-shadow-[2px_2px_0px_#044412] text-white"
          >
            Drop
          </span>
        </button>

        <button
          onClick={onDiscard}
          disabled={
            !isPlayerTurn ||
            selectedIndices.length !== 1 ||
            !hasDrawnThisTurn ||
            gameEnded ||
            drawnCard
          }
          className="bg-green-500 p-2 rounded-full w-32  bg-gradient-to-t to-[#F600FF] from-[#C200C9] drop-shadow-[2px_7px_2px_#86008B] border-2 border-[#FB84FF]"
        >
          <span
            onClick={animateClick}
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity:
                !isPlayerTurn ||
                selectedIndices.length !== 1 ||
                !hasDrawnThisTurn ||
                gameEnded ||
                drawnCard
                  ? 0.5
                  : 1,
            }}
            className="font-black text-xl drop-shadow-[2px_2px_0px_#044412] text-white"
          >
            Dump
          </span>
        </button>

        <button
          onClick={onSapaw}
          disabled={
            !isPlayerTurn ||
            !selectedSapawTarget ||
            selectedIndices.length === 0 ||
            !hasDrawnThisTurn ||
            gameEnded
          }
          className="bg-green-500 p-2 rounded-full w-32  bg-gradient-to-t to-[#2AC1EF] from-[#206AB4] drop-shadow-[2px_7px_2px_#106390] border-2 border-[#47B0FF]"
        >
          <span
            onClick={animateClick}
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity:
                !isPlayerTurn ||
                !selectedSapawTarget ||
                selectedIndices.length === 0 ||
                !hasDrawnThisTurn ||
                gameEnded
                  ? 0.5
                  : 1,
            }}
            className="font-black text-xl drop-shadow-[2px_2px_0px_#044412] text-white"
          >
            Sapaw
          </span>
        </button>
        <button
          onClick={onFight}
          disabled={
            !enableFight ||
            !isPlayerTurn ||
            gameEnded ||
            isCurrentPlayerSapawTarget ||
            hasDrawnThisTurn ||
            isSapawed
          }
          className="bg-green-500 p-2 rounded-full w-32  bg-gradient-to-t to-[#FFF652] from-[#C8B700] drop-shadow-[2px_7px_2px_#888013] border-2 border-[#FFF467]"
        >
          <span
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity:
                !isPlayerTurn ||
                gameEnded ||
                !enableFight ||
                isCurrentPlayerSapawTarget ||
                hasDrawnThisTurn ||
                isSapawed
                  ? 0.5
                  : 1,
            }}
            onClick={animateClick}
            className="font-black text-xl drop-shadow-[2px_2px_0px_#044412] text-white"
          >
            Fight
          </span>
        </button>

        <div className="w-32 h-28 bg-gradient-to-t to-[#FFB96D] from-[#E27500] drop-shadow-[2px_7px_2px_#BF6709] border-2 border-[#FFB059] flex flex-col items-center rounded-xl p-2">
          <PlayerPoints
            socket={socket}
            gameState={gameState}
            getCardValue={calculateCardPoints}
          />
        </div>
      </div>
      <div className="h-full flex gap-1 justify-center items-center ">
        {/* <button onClick={onAutoSort}>
          <img
            onClick={animateClick}
            src="/image/auoSort.svg"
            alt="Auto Sort"
            className="w-32 h-32"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
        <button onClick={onShuffle}>
          <img
            onClick={animateClick}
            src="/image/shuffleButton.svg"
            alt="Shuffle"
            className="w-32 h-32"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button> */}
        {/* <button>
          <img
            onClick={animateClick}
            src="/image/withdrawButton.svg"
            alt="Withdraw"
            className="w-36 h-32"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
        <button>
          <img
            onClick={animateClick}
            src="/image/depositButton.svg"
            alt="Deposit"
            className="w-36 h-32"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button> */}
      </div>
    </div>
  );
};

export default GameFooter;
