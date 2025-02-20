import React from "react";
import { Card } from "../TongitsGame/play-bot/Card";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function Discardpile({ isOpen, onClose, discardCard, TextContent }) {
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className=" w-2/3 h-3/4 bg-gradient-to-b from-white to-[#2130D4]/80 relative flex justify-center items-center ">
            <div className="gap-2 flex flex-row justify-center items-center absolute top-0 bg-gradient-to-b from-[#000000]/60 to-[#F05C30]/80 w-full h-16 border-2 border-[#9C502D]">
              <div className="flex flex-row justify-center items-center gap-1">
                <div className="skew-x-[40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D] "></div>
                <div className="skew-x-[40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D]"></div>
                <div className="skew-x-[40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D]"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <Image
                  width={1000}
                  height={1000}
                  src="/image/header-modal.svg"
                  alt="My image"
                  className="w-96 mt-2 "
                />
                <div className="absolute">
                  <h1 className="font-black text-center text-4xl text-white drop-shadow-[3px_5px_0px_black]">
                    {TextContent}
                  </h1>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center gap-1">
                <div className="skew-x-[-40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D]"></div>
                <div className="skew-x-[-40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D]"></div>
                <div className="skew-x-[-40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D]"></div>
              </div>
            </div>
            <Image
              width={1000}
              height={1000}
              src="/image/wood.svg"
              alt="My image"
              className="w-10 absolute -left-4 h-full"
            />
            <Image
              width={1000}
              height={1000}
              src="/image/wood.svg"
              alt="My image"
              className="w-10 absolute -right-5 h-full"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="rounded-lg  w-auto relative flex justify-center flex-row p-5 gap-2"
            >
              <button onClick={onClose}>
                <Image
                  width={1000}
                  height={1000}
                  src="/image/discardpileClosebtn.svg"
                  alt="My image"
                  className="w-10 h-10 absolute -top-12 -right-12"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </button>
              <div className="mt-10 flex justify-center items-center gap-3">
                <div className="bg-[rgba(13,65,237,0.5)] h-96 w-56   flex text-6xl text-black items-center flex-col py-5 rounded-lg">
                  <div className="bg-gradient-to-b from-[#0000EB] to-[#000000] h-auto py-2 px-3 rounded-xl text-white">
                    ♠
                  </div>
                  <div className="flex flex-row w-full flex-wrap p-2 gap-1 justify-center">
                    {spades.map((card, index) => {
                      return (
                        <div key={index}>
                          <Card
                            transformCard={`perspective(500px) rotateX(0deg)`}
                            border={`2px solid white`}
                            cardSize={"w-16 h-20 p-1 text-lg 2xl:text-lg"}
                            card={card}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-[rgba(13,65,237,0.5)] h-96 w-56  flex text-6xl text-red-600 items-center flex-col py-5 rounded-lg">
                  <div className="bg-gradient-to-b from-[#0000EB] to-[#000000] h-auto py-2 px-3 rounded-xl text-white">
                    ♥
                  </div>
                  <div className="flex flex-row w-full flex-wrap p-2 gap-1 justify-center">
                    {hearts.map((card, index) => {
                      return (
                        <div key={index}>
                          <Card
                            transformCard={`perspective(500px) rotateX(0deg)`}
                            border={`2px solid white`}
                            cardSize={"w-16 h-20 p-1 text-lg 2xl:text-lg"}
                            card={card}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-[rgba(13,65,237,0.5)] h-96 w-56   flex text-6xl text-black items-center flex-col py-5 rounded-lg">
                  <div className="bg-gradient-to-b from-[#0000EB] to-[#000000] h-auto py-2 px-3 rounded-xl text-white">
                    ♣
                  </div>
                  <div className="flex flex-row w-full flex-wrap p-2 gap-1 justify-center">
                    {clubs.map((card, index) => {
                      return (
                        <div key={index}>
                          <Card
                            transformCard={`perspective(500px) rotateX(0deg)`}
                            border={`2px solid white`}
                            cardSize={"w-16 h-20 p-1 text-lg 2xl:text-lg"}
                            card={card}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-[rgba(13,65,237,0.5)] h-96 w-56   flex text-6xl text-red-600 items-center flex-col py-5 rounded-lg">
                  <div className="bg-gradient-to-b from-[#0000EB] to-[#000000] h-auto py-2 px-3 rounded-xl text-white">
                    ♦
                  </div>
                  <div className="flex flex-row w-full flex-wrap p-2 gap-1 justify-center">
                    {diamond.map((card, index) => {
                      return (
                        <div key={index}>
                          <Card
                            transformCard={`perspective(500px) rotateX(0deg)`}
                            border={`2px solid white`}
                            cardSize={"w-16 h-20 p-1 text-lg 2xl:text-lg"}
                            card={card}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Discardpile;
