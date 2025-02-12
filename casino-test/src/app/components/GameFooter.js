/* eslint-disable @next/next/no-img-element */
"use client"

import React from "react";

const GameFooter = ({
  onMeld,
  onDiscard,
  onSapaw,
  onCallDraw,
  onFight,
  onChallenge,
  isPlayerTurn,
  gameEnded,
  hasDrawnThisTurn,
  selectedIndices,
  selectedSapawTarget,
  onAutoSort,
  onShuffle,
  enableFight,
  isCurrentPlayerSapawTarget,
  isSapawed
}) => {
  const [scale, setScale] = React.useState(1);

  const animateClick = () => {
    setScale(0.99);
    setTimeout(() => setScale(1), 300);
  };

  return (
    <div className="px-16 2xl:px-36 flex w-screen items-center gap-11 h-32 absolute bottom-0 left-0 justify-between">
      <div className="space-x-3">
        <button
          onClick={onMeld}
          disabled={!isPlayerTurn || selectedIndices.length < 3 || !hasDrawnThisTurn || gameEnded}
        >
          <img
            onClick={animateClick}
            src="/image/dropButton.svg"
            alt="Meld"
            className="w-[115px] 2xl:w-[145px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity: (!isPlayerTurn || selectedIndices.length < 3 || !hasDrawnThisTurn || gameEnded) ? 0.5 : 1
            }}
          />
        </button>
        <button
          onClick={onDiscard}
          disabled={!isPlayerTurn || selectedIndices.length !== 1 || !hasDrawnThisTurn || gameEnded}
        >
          <img
            onClick={animateClick}
            src="/image/dumpButton.svg"
            alt="Discard"
            className="w-[115px] 2xl:w-[145px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity: (!isPlayerTurn || selectedIndices.length !== 1 || !hasDrawnThisTurn || gameEnded) ? 0.5 : 1
            }}
          />
        </button>
        <button
          onClick={onSapaw}
          disabled={!isPlayerTurn || !selectedSapawTarget || selectedIndices.length === 0 || !hasDrawnThisTurn || gameEnded}
        >
          <img
            onClick={animateClick}
            src="/image/sapawButton.svg"
            alt="Sapaw"
            className="w-[115px] 2xl:w-[145px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity: (!isPlayerTurn || !selectedSapawTarget || selectedIndices.length === 0 || !hasDrawnThisTurn || gameEnded) ? 0.5 : 1
            }}
          />
        </button>
        <button
          onClick={onFight}
          disabled={ !enableFight || !isPlayerTurn || gameEnded || isCurrentPlayerSapawTarget || hasDrawnThisTurn || isSapawed}
        >
          <img
            onClick={animateClick}
            src="/image/fightButton.svg"
            alt="Fight"
            className="w-[115px] 2xl:w-[145px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
              opacity: (!isPlayerTurn || gameEnded || !enableFight || isCurrentPlayerSapawTarget || hasDrawnThisTurn || isSapawed) ? 0.5 : 1
            }}
          />
        </button>
      </div>
      <div className="h-full flex gap-1 justify-center items-center">
        <button onClick={onAutoSort}>
          <img
            onClick={animateClick}
            src="/image/auoSort.svg"
            alt="Auto Sort"
            className="w-32 h-32"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out"
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
              transition: "transform 0.3s ease-in-out"
            }}
          />
        </button>
        <button>
          <img
            onClick={animateClick}
            src="/image/withdrawButton.svg"
            alt="Withdraw"
            className="w-36 h-32"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out"
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
              transition: "transform 0.3s ease-in-out"
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default GameFooter;