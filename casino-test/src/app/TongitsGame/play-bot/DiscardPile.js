
import React, { useRef, useEffect } from "react";
import { Player } from "../../../hooks/use-tongit-game";
import { Card as CardType } from "../../../utils/card-utils";
import { Card } from "./Card";
import Arrow from "@/app/components/Arrow";

export function DiscardPile({
  currentPlayer,
  topCard,
  onDraw,
  disabled,
  canDraw,
  setPosition,
}) {
  const posRef = useRef(null);

  useEffect(() => {
    if (posRef.current) {
      const rect = posRef.current.getBoundingClientRect();
      const { x, y } = rect;
      setPosition({ x, y });
    }
  }, [setPosition]);



  if (!topCard) {
    return (
      <button
      ref={posRef}
        className=" w-1.5 2xl:w-20 h-24 2xl:h-28 bg-gray-300 border border-black rounded-lg shadow-md flex items-center justify-center"
        disabled={true}
      >
        Empty
      </button>
    );
  }

  return (
    <div
    >
      <button
      ref={posRef}  
        className={`p-0 bg-transparent hover:bg-transparent  ${
          !canDraw || !currentPlayer ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onDraw}
        disabled={disabled || !canDraw || !currentPlayer}
      >
        {canDraw && currentPlayer && <Arrow />}
        <Card
          cardSize={"w-1.5 2xl:w-20 h-24 2xl:h-28 p-1 text-5xl 2xl:text-2xl p-3"}
          card={topCard}
        />
      </button>
    </div>
  );
}
