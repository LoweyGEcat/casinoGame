"use client";
import { useState } from "react";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import CrystalSnowAnimation from "./snowflakes";
import { motion } from 'framer-motion'

function Scoreboard({ gameState, onClose }) {
  const scoreboardRef = useRef(null);
  const router = useRouter();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const scoreboard = scoreboardRef.current;

    gsap.set(scoreboard, { scale: 0.5, opacity: 0 });

    gsap.to(scoreboard, {
      duration: 0.5,
      scale: 1,
      opacity: 1,
      ease: "back.out(1.7)",
      onComplete: () => {
        // Animation complete callback if needed
      },
    });
  }, []);

  const animateClick = () => {
    setScale(0.99);
    setTimeout(() => {
      setScale(1);
    }, 300);
  };
  console.log(gameState, "Game State");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.1 }}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div>
      {/* Overlay */}
      <div
        className="fixed inset-0  z-20 bg-opacity-90"
        style={{
          background: "linear-gradient(to bottom, #021821, #954A4A)",
          height: "100vh",
        }}
      >
        {/* Button */}
        <button
          className="text-black hover:text-gray-500 top-0 left-0 focus:outline-none  shadow-md focus:text-gray-500 transition ease-in-out duration-150 z-10 "
          onClick={onClose}
        >
          <img
            onClick={animateClick}
            src="/image/existButton.svg"
            alt="My image"
            className="w-[95px] 2xl:w-[95px] h-full"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
      </div>
      {/* Score board Title */}
      <div className="w-full h-24  top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 absolute lg:w-10/12 ">
        <img
          onClick={animateClick}
          src="/image/scoreboardHeader.svg"
          alt="My image"
          className="w-full 2xl:w-[95px] h-full"
          style={{
            transition: "transform 0.3s ease-in-out",
          }}
        />
      </div>
      {/* ScoreBoard */}
      <div
        ref={scoreboardRef}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 lg:w-10/12 lg:h-4/6 z-30 rounded-lg border border-gray-600 shadow-2xl opacity-80"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-rows-4 grid-cols-9 h-5/6 w-11/12">
          {/* Dashboard */}
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Players
          </div>
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Score
          </div>
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Profit
          </div>
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Consecutive wins
          </div>
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Tongits
          </div>
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Secret melds
          </div>
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Burned Players
          </div>
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Challengers
          </div>
          <div
            className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
            style={{
              WebkitTextStroke: "1px black",
              textStroke: "0.5px black",
            }}
          >
            Hitpot
          </div>
          {/* Player */}
          {gameState.players.map((player, index) => (
            <React.Fragment key={index}>
              <div
                className="border-2 text-white flex-col font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                {player.name}
                <p
                  className="mt-2 font-bold text-lg text-[#FFCD06]"
                  style={{
                    WebkitTextStroke: "0.5px black",
                    textStroke: "0.5px black",
                  }}
                >
                  {" "}
                  {gameState?.winner?.id === player.id ? "Winner" : ""}
                </p>
              </div>
              <div
                className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                {player.score}
              </div>
              <div
                className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                0
              </div>
              <div
                className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                {player.consecutiveWins}
              </div>
              <div
                className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                0
              </div>
              <div
                className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                {player.secretMelds.length}
              </div>
              <div
                className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                {player.exposedMelds.length > 0 ? "0" : "1"}
              </div>
              <div
                className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                {player.turnsPlayed}
              </div>
              <div
                className="border-2 text-white font-extrabold font-robotoSans flex items-center justify-center text-2xl tracking-tight text-center"
                style={{
                  WebkitTextStroke: "1px black",
                  textStroke: "0.5px black",
                }}
              >
                {/* hitpot */}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <CrystalSnowAnimation />
    </div>
    </motion.div>
  );
}

export default Scoreboard;