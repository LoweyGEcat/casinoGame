import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./Card";
import { Player } from "../../../hooks/use-tongit-game";
import { Card as CardType } from "../../../utils/card-utils";
import PlayerIcon from "@/app/components/PlayerIcon";

export function MeldedCards({
  gameState,
  socket,
  players,
  onSapawSelect,
  currentPlayerIndex,
  selectedSapawTarget,
}) {
  const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const sortCardsByRank = (cards) => {
    return cards.sort((a, b) => {
      const rankA = rankOrder.indexOf(a.rank);
      const rankB = rankOrder.indexOf(b.rank);
      return rankA - rankB;
    });
  };

  const sortMelds = (melds) => {
    return melds.map((meld) => sortCardsByRank(meld));
  };

  // SAPAW Action: Apply SAPAW by adjusting card ranks and sorting after
  const applySapaw = (melds, sapawCard) => {
    if (!melds || !sapawCard) return melds;
    
    const newMelds = melds.map(meld => {
      if (!meld) return [];
      // Find the card to apply SAPAW action
      const sapawIndex = meld.findIndex(card => card.rank === sapawCard.rank);
      if (sapawIndex !== -1) {
        const newMeld = [...meld];
        newMeld[sapawIndex] = { ...meld[sapawIndex], rank: sapawCard.rank };
        return newMeld;
      }
      return meld;
    });

    // Sort the melds after the SAPAW
    return sortMelds(newMelds);
  };

  // Determine the current player's index based on socket.id
  const currentPlayerPOV = useMemo(() => {
    return players.findIndex(player => player.id === socket);
  }, [players, socket]);

  // Function to calculate relative player index
  const getRelativePlayerIndex = (absoluteIndex) => {
    return (absoluteIndex - currentPlayerPOV + players.length) % players.length;
  };

  // Function to get positioning class based on relative index
  const getPositioningClass = (relativeIndex) => {
    switch (relativeIndex) {
      case 0:
        return "bottom-72 left-96 right-96 -translate-x-1/2 z-10";
      case 1:
        return "top-44 2xl:top-72 right-64 2xl:right-96 z-10";
      case 2:
        return "top-44 2xl:top-72 left-72 2xl:left-96 z-10";
      default:
        return "";
    }
  };

  // Function to get PlayerIcon positioning
  const getPlayerIconPositioning = (relativeIndex) => {
    switch (relativeIndex) {
      case 0:
        return "hidden";
      case 1:
        return "top-36 right-14 2xl:right-32 z-20";
      case 2:
        return "top-36 2xl:top-48 left-14 2xl:left-32 z-20";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {players.map((player, absoluteIndex) => {
        const relativeIndex = getRelativePlayerIndex(absoluteIndex);
        const sortedMelds = selectedSapawTarget 
          ? applySapaw(player.exposedMelds, selectedSapawTarget) 
          : sortMelds(player.exposedMelds);
        
        const isCurrentPlayer = absoluteIndex === currentPlayerIndex;
        
        return (
          <div key={player.id}>
            <PlayerIcon
              playerIndex={absoluteIndex}
              players={players}
              positioning={getPlayerIconPositioning(relativeIndex)}
              currentPlayerPOV={socket?.id}
            />
            <div
              className={`
              absolute pointer-events-auto w-80
              ${getPositioningClass(relativeIndex)}
            `}
            >
              <div className={`bg-opacity-0 bg-white ${relativeIndex === 0 ? "w-[1000px] flex justify-start" : ""} rounded-lg`}>
                <AnimatePresence>
                  {sortedMelds?.map((meld, meldIndex) => (
                    <motion.div
                      key={meldIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale:
                          selectedSapawTarget?.playerIndex === absoluteIndex &&
                          selectedSapawTarget?.meldIndex === meldIndex
                            ? 1.05
                            : 1,
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-lg first-line: ${
                        selectedSapawTarget?.playerIndex === absoluteIndex &&
                        selectedSapawTarget?.meldIndex === meldIndex
                          ? "bg-black bg-opacity-30 flex h-auto justify-start"
                          : "flex justify-start h-auto"
                      }`}
                      onClick={() => onSapawSelect({ playerIndex: absoluteIndex, meldIndex })}
                    >
                      <div className="flex flex-row flex-wrap">
                        {meld?.map((card, cardIndex) => (
                          <motion.div
                            key={cardIndex}
                            initial={{ scale: 0 }}
                            animate={{
                              scale: 1,
                              x: cardIndex * -20,
                            }}
                            transition={{ delay: cardIndex * 0.1 }}
                            className="transform scale-75 origin-top-left cursor-pointer rounded-md"
                          >
                            <Card
                              border={`1px solid black`}
                              transformCard={`perspective(500px) rotateX(40deg)`}
                              cardSize={"w-14 h-auto p-1 text-xl 2xl:text-lg"}
                              card={card}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

