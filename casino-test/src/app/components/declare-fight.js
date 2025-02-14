"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import FireEffect from "./war-animation";
import LightningEffect from "./lightning-Effects";
import RainEffects from "./rain-effects";
import RainAnimation from "./rain-effects";

const DeclareWar = ({ gamestate, socketId }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const playerInitiate = gamestate?.players.find(
    (p) => gamestate?.lastAction?.id === p.id
  );
  const playerPOVInititate = playerInitiate?.id === socketId;

  useEffect(() => {
    if (
      gamestate?.lastAction?.type === "initiated a fight" &&
      playerPOVInititate
    ) {
      setIsModalActive(true);
    }
  }, [gamestate?.lastAction, playerPOVInititate]);

  const closeModal = () => {
    setIsModalActive(false);
  };

  return (
    <AnimatePresence>
      {isModalActive && (
        <motion.div
          className={`modal-container two ${isModalActive ? "" : "out"}`}
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-background z-50">
            <motion.div
              className="bg-orange-400 h-full w-1/2  absolute inset-y-0 left-0 left_player mt-40"
              initial={{ x: -1500, skew: "30deg", scaleX: 1.3 }}
              animate={{ x: 0, skew: "0deg", scaleX: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.3,
              }}
            >
              <LightningEffect />
            </motion.div>
            {/* {innitiatir } */}
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="absolute inset-x-0 bottom-0">
                <FireEffect />
                <div className="absolute inset-x-0 bottom-72 ">
                  <div>
                    <div className="flame">
                      <h1 className="fire-text_h1 text-[8rem]">
                        <span className="font-[1000] fire-text_span tracking-[.15em]">
                          FIGHT
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              className="bg-emerald-400 h-full w-1/2 absolute inset-y-0 right-0 right_player mt-40"
              initial={{ x: 1500, skew: "-30deg", scaleX: 1.3 }}
              animate={{ x: 0, skew: "0deg", scaleX: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.3,
              }}
            >
              <RainAnimation />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeclareWar;
