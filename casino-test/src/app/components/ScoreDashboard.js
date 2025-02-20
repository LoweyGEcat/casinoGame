"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Card } from "../TongitsGame/play-bot/Card";
import Scoreboard from "./Scoreboard";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ScoreDashboard({
  socketId,
  gameState,
  onClose,
  resetGame,
  Reset,
  ContinueGame,
}) {
  const hasResetRef = useRef(false);
  const scoreboardRef = useRef(null);
  // const [scale, setScale] = useState(1);
  const [isWinner, setIsWinner] = useState();
  const [countdown, setCountdown] = useState(100);
  const [closing, setClosing] = useState(false); // Added closing state
  const [showDetails, setShowDetails] = useState(false); // New state for toggling scoreboard visibility
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const router = useRouter();
  const winners = gameState.players.filter((p) => p.consecutiveWins === 2);

  console.log("winners", gameState);

  // Animate for pop up
  useEffect(() => {
    const scoreboard = scoreboardRef.current;
    gsap.set(scoreboard, { scale: 0.5, opacity: 0 });

    gsap.to(scoreboard, {
      duration: 0.5,
      scale: 1,
      opacity: 1,
      ease: "back.out(1.7)",
    });
  }, []);

  useEffect(() => {
    if (gameState) {
      setIsWinner(gameState.winner.id);
    }
  }, [gameState]);

  useEffect(() => {
    if (!closing) return;

    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          if (!hasResetRef.current) {
            hasResetRef.current = true;
            onClose();
            setShouldNavigate(true);
          }
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [closing, Reset, onClose]);

  useEffect(() => {
    setClosing(true); // Start the countdown immediately when the component mounts
  }, []);

  useEffect(() => {
    if (shouldNavigate) {
      if (winners.length > 0) {
        resetGame();
      } else {
        Reset();
      }
    }
  }, [shouldNavigate, gameState, Reset]);

  // Handle close and reset the scoreboard with animation
  const handleClose = () => {
    setClosing(true); // Start countdown
    gsap.to(scoreboardRef.current, {
      duration: 0.5,
      opacity: 0,
      scale: 0.5,
      ease: "back.in(1.7)",
      onComplete: () => {
        onClose(); // Close the scoreboard
      },
    });
  };

  // Toggle the scoreboard details visibility
  const handleViewDetails = () => {
    setShowDetails((prevState) => !prevState); // Toggle the scoreboard visibility
  };

  return (
    <motion.div
      key={socketId}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="relative w-full h-full bg-black/50 items-center flex justify-center">
        <div
          ref={scoreboardRef}
          className="w-2/3 h-3/4 bg-gradient-to-b from-white to-[#2130D4]/80 relative items-center flex justify-center"
        >
          <div className="gap-2 flex flex-row justify-center items-center absolute top-0 bg-gradient-to-b from-[#000000]/60 to-[#F05C30]/80 w-full h-16 border-2 border-[#9C502D]">
            <div className="flex flex-row justify-center items-center gap-1">
              <div className="skew-x-[40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D] "></div>
              <div className="skew-x-[40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D]"></div>
              <div className="skew-x-[40deg] w-14 h-12 bg-[#D9D9D980] border-2 border-[#9C502D]"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <img
                src={
                  isWinner === socketId
                    ? "/image/winner.svg"
                    : "/image/defeat.svg"
                }
                alt="My image"
                className="w-96 -mt-7"
                style={{
                  transition: "transform 0.3s ease-in-out",
                }}
              />
              {/* <Image
                width={1000}
                height={1000}
                src="/image/header-modal.svg"
                alt="My image"
                className="w-96 mt-2 "
              /> */}
              <div className="absolute">
                <h1 className="font-black text-center text-4xl text-white drop-shadow-[3px_5px_0px_black]">
                  {/* {TextContent} */}
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

          {/* CONTAINER */}
          <div className="w-full mt-16 h-auto flex flex-col p-10 items-center justify-center gap-5">
            {gameState.players.map((player, index) => {
              return (
                <div
                  className="w-full h-28 bg-opacity-5 bg-gradient-to-b from-[rgba(33,61,139,0.5)] to-[rgba(73,81,128,0.5)] border-4 border-yellow-300 rounded-lg flex flex-row gap-3 relative"
                  key={index}
                >
                  <div className="flex h-full items-center pl-5 w-auto">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1400/1*rKl56ixsC55cMAsO2aQhGQ@2x.jpeg"
                      className="rounded-full border-2 border-yellow-300 bg-black w-16 h-16"
                    />
                  </div>
                  <div className="p-2">
                    <div className="flex flex-col gap-2  h-full w-full items-center">
                      <h3
                        className="font-robotoSans font-extrabold text-white text-2xl"
                        style={{
                          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {player.name}
                      </h3>
                      <div
                        className="w-40 bg-yellow-400 border rounded-lg"
                        style={{ backgroundColor: "yellow !important" }}
                      ></div>
                      <div>
                        <h3
                          className="text-3xl font-black"
                          style={{
                            color:
                              player.id === isWinner ? "#FFEE00" : "#CEC9C9",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          {player.id === isWinner ? "WINNER!" : "Lose!"}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center w-10">
                    <div className="flex flex-row justify-between">
                      {player.hand.map((card, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{
                            scale: 1,
                            x: index * -25, // Shift each card along the X axis
                          }}
                          className="transform scale-75 origin-top-left cursor-pointer rounded-md"
                        >
                          <Card
                            border={`1px solid black`}
                            transformCard={`perspective(500px) rotateX(0deg)`}
                            cardSize={"w-14 h-20 p-1 text-md 2xl:text-lg"}
                            card={card}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="">
                    <div className="absolute right-0 p-5 flex flex-row justify-center gap-2 items-center ">
                      <div className="rounded-full p-2 text-2xl bg-[url('/image/pointsBG.svg')] bg-no-repeat bg-cover bg-center font-extrabold border-2 w-14 h-14 border-black items-center justify-center flex ">
                        {player.score}
                      </div>
                      <h4 className="text-white font-bold text-xl">Points</h4>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* <div className=" flex justify-end text-white font-extrabold text-xl gap-2">
              {gameState.players.some((p) => p.consecutiveWins === 2) ? (
                <>
                  <button
                    onClick={resetGame}
                    className="bg-text-gradient py-2 px-5 rounded-full border-2 border-slate-300"
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Quit
                  </button>
                  <button
                    onClick={ContinueGame}
                    className="bg-Button-gradient py-2 px-5 rounded-full border-2 border-slate-300"
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleClose}
                    className="bg-text-gradient py-2 px-5 rounded-full border-2 border-slate-300 "
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={handleViewDetails}
                    className="bg-Button-gradient py-2 px-5 rounded-full border-2 border-slate-300"
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    View Details
                  </button>
                </>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ScoreDashboard;
