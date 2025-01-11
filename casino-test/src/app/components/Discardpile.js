import React from "react";
import { Card } from "../TongitsGame/play-bot/Card";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function Discardpile({ isOpen, onClose, discardCard }) {
  const spades = discardCard.filter((card) => card?.suit === "spades");
  const hearts = discardCard.filter((card) => card?.suit === "hearts");
  const diamond = discardCard.filter((card) => card?.suit === "diamonds");
  const clubs = discardCard.filter((card) => card?.suit === "clubs");
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <Image
            src="/image/discardPileBG.svg"
            width={1000}
            height={1000}
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
            <button onClick={onClose}>
              <Image
                width={1000}
                height={1000}
                src="/image/discardpileClosebtn.svg"
                alt="My image"
                className="w-14 h-14 absolute -top-10 -right-12"
                style={{
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
            <div className="bg-[rgba(13,65,237,0.5)] h-96 w-56 mt-10  flex text-6xl text-black items-center flex-col py-5">
              <div className="bg-white h-auto py-2 px-3 rounded-xl">♠</div>
              <div className="flex flex-row w-full flex-wrap p-2 gap-1 justify-center">
                {spades.map((card, index) => {
                  return (
                    <div key={index}>
                      <Card
                        transformCard={`perspective(500px) rotateX(0deg)`}
                        border={`1px solid black`}
                        cardSize={"w-16 h-20 p-1 text-lg 2xl:text-lg"}
                        card={card}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-[rgba(13,65,237,0.5)] h-96 w-56 mt-10  flex text-6xl text-red-600 items-center flex-col py-5">
              <div className="bg-white h-auto py-2 px-3 rounded-xl">♥</div>
              <div className="flex flex-row w-full flex-wrap p-2 gap-1 justify-center">
                {hearts.map((card, index) => {
                  return (
                    <div key={index}>
                      <Card
                        transformCard={`perspective(500px) rotateX(0deg)`}
                        border={`1px solid black`}
                        cardSize={"w-16 h-20 p-1 text-lg 2xl:text-lg"}
                        card={card}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-[rgba(13,65,237,0.5)] h-96 w-56 mt-10  flex text-6xl text-black items-center flex-col py-5">
              <div className="bg-white h-auto py-2 px-3 rounded-xl">♣</div>
              <div className="flex flex-row w-full flex-wrap p-2 gap-1 justify-center">
                {clubs.map((card, index) => {
                  return (
                    <div key={index}>
                      <Card
                        transformCard={`perspective(500px) rotateX(0deg)`}
                        border={`1px solid black`}
                        cardSize={"w-16 h-20 p-1 text-lg 2xl:text-lg"}
                        card={card}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-[rgba(13,65,237,0.5)] h-96 w-56 mt-10  flex text-6xl text-red-600 items-center flex-col py-5">
              <div className="bg-white h-auto py-2 px-3 rounded-xl">♦</div>
              <div className="flex flex-row w-full flex-wrap p-2 gap-1 justify-center">
                {diamond.map((card, index) => {
                  return (
                    <div key={index}>
                      <Card
                        transformCard={`perspective(500px) rotateX(0deg)`}
                        border={`1px solid black`}
                        cardSize={"w-16 h-20 p-1 text-lg 2xl:text-lg"}
                        card={card}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Discardpile;
