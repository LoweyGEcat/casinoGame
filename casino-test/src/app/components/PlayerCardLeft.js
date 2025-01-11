import React from "react";
import { Card } from "../TongitsGame/play-bot/Card";
import { motion, AnimatePresence } from "framer-motion";

function PlayerCardLeft({ isOpen, onClose,playercard }) {
  const playerBackground = ['roundendedBgplayer1.svg', 'roundendedBgplayer2.svg','roundendedBgplayer3.svg']
  console.log("playerCard", playercard);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <img
            src="/image/roundedEndBG.svg"
            alt="My image"
            className="w-3/4 h-3/4 absolute"
            style={{
              transition: "transform 0.3s ease-in-out",
            }}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="rounded-lg p-6 w-auto relative flex justify-center flex-row gap-2"
          >
            <div>
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PlayerCardLeft;
