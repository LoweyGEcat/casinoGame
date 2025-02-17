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
        className="w-16 h-20 bg-white drop-shadow-[0px_8px_0px_#044412] rounded-lg items-center flex justify-center"
        disabled={true}
      >
        Empty
      </button>
    );
  }

  return (
    <div>
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
          cardSize={
            "w-16 h-20  p-1 text-2xl drop-shadow-[5px_8px_0px_#044412] border-4 rounded-lg"
          }
          card={topCard}
        />
      </button>
    </div>
  );
}
