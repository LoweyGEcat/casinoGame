"use client";
import React, { useState } from "react";
import NetworkStatus from "@/app/components/NetworkStatus";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function GameBet() {
  // const [bet, setBet] = useState();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("REGULAR"); // State to manage active tab
  const handleButtonClickLive = (bet) => {
    router.push(`/TongitsGame/live-game/multiplayer?betAmount=${bet}`);
  };
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const exitGamebet = () => {
    router.push("/TongitsGame");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#080E81] to-[#254F64]">
      <div className="w-full h-10 mb-8">
        {/* <div className="grid grid-cols-3 gap-5">
          <div className="bg-white">
          </div>
          <div className="bg-white ">01</div>
          <div className="bg-white">01</div>
        </div> */}
        <button onClick={exitGamebet} className="absolute top-4 left-4">
          <Image
            src="/image/existButton.svg"
            alt="My image"
            width={50}
            height={50}
            className="w-full h-full"
            style={{
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
      </div>

      <div className="flex flex-col items-center mx-auto">
        <div className="grid grid-cols-3 w-11/12 mb-3">
          <div className="flex items-center border-l border-[#f7e479] border-t rounded-lg left_tabs">
            <div className="w-full flex items-center justify-start gap-5 p-3">
              <button
                type="button"
                className={`btn ${activeTab === "REGULAR" ? "active" : ""}`}
                onClick={() => setActiveTab("REGULAR")}
              >
                <strong className="font-bold text-xl">REGULAR</strong>
                <div id="container-stars">
                  <div id="stars"></div>
                </div>

                <div id="glow">
                  <div className="circle "></div>
                  <div className="circle "></div>
                </div>
              </button>

              <button
                type="button"
                className={`btn ${activeTab === "VIP" ? "active" : ""}`}
                onClick={() => setActiveTab("VIP")}
              >
                <strong className="font-bold text-xl">VIP</strong>
                <div id="container-stars">
                  <div id="stars"></div>
                </div>

                <div id="glow">
                  <div className="circle "></div>
                  <div className="circle "></div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full flex items-center justify-center">
              <Image
                src="/image/gamebetCrown.svg"
                alt="My image"
                width={100}
                height={100}
                className="animate-bounce absolute "
              />
              <div className="loader"></div>
            </div>
          </div>

          <div className="border-r border-[#f7e479] border-t rounded-lg tabs_container"></div>
        </div>
        <div className="p-16 main_container w-11/12  h-auto border-[#f7e479] border-t-2 border-b-2 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "VIP" ? (
              <>
                {/* VIP Category */}
                <motion.section
                  key="vip"
                  initial={{ opacity: 0, rotateY: 90, scale: 0.5 }} // Start with rotation and scale
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }} // Animate to normal state
                  exit={{ opacity: 0, rotateY: -90, scale: 0.5 }} // Exit with rotation and scale
                  transition={{ duration: 0.5 }}
                >
                  <section className="">
                    <div className="grid grid-cols-2 gap-8">
                      {/* VIP Category */}
                      <div className="...">
                        <div className="flex flex-row gap-4 items-center">
                          {/* Card 1 */}
                          <div className="card transform skew-x-[5deg] ">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#CCCCCC] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#CCCCCC] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>

                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    100,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(100000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2 */}
                          <div className="card transform skew-x-[5deg] ">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#BFBA16] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#BFBA16] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>

                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    50,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(50000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 3 */}
                          <div className="card  transform skew-x-[5deg] ">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#1B94A9] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#1B94A9] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>

                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    20,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(20000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Regular Category */}
                      <div className="...">
                        <div className="flex flex-row gap-4 items-center">
                          {/* Card 1 */}
                          <div className="card  transform skew-x-[-5deg] ">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#93259D] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#93259D] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg " />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>

                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    5,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(5000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2 */}
                          <div className="card  transform skew-x-[-5deg]">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#B88142] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#B88142] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>
                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    10,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(10000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 3 */}
                          <div className="card  transform skew-x-[-5deg]">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#A61212] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#A61212] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>
                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    15,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(15000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.section>
              </>
            ) : (
              <>
                <motion.section
                  key="regular"
                  initial={{ opacity: 0, rotateY: 90, scale: 0.5 }} // Start with rotation and scale
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }} // Animate to normal state
                  exit={{ opacity: 0, rotateY: -90, scale: 0.5 }} // Exit with rotation and scale
                  transition={{ duration: 0.5 }}
                >
                  <section className="">
                    <div className="grid grid-cols-2 gap-8">
                      {/* VIP Category */}
                      <div className="...">
                        <div className="flex flex-row gap-4 items-center">
                          {/* Card 1 */}
                          <div className="card transform skew-x-[5deg] ">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#CCCCCC] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#CCCCCC] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>

                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    100,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(100000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2 */}
                          <div className="card transform skew-x-[5deg] ">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#BFBA16] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#BFBA16] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>

                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    50,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(50000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 3 */}
                          <div className="card  transform skew-x-[5deg] ">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#1B94A9] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#1B94A9] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>

                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    20,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(20000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Regular Category */}
                      <div className="...">
                        <div className="flex flex-row gap-4 items-center">
                          {/* Card 1 */}
                          <div className="card  transform skew-x-[-5deg] ">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#93259D] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#93259D] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg " />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>

                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    5,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(5000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2 */}
                          <div className="card  transform skew-x-[-5deg]">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#B88142] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#B88142] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>
                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    10,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(10000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 3 */}
                          <div className="card  transform skew-x-[-5deg]">
                            <div className="content">
                              <div className="back">
                                <div className="back-content bg-gradient-to-b from-[#A61212] to-[#737373]">
                                  <div className="shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b from-[#A61212] to-[#737373]">
                                    <div className="absolute -top-2 -left-5">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start my-2 border-2 rounded-lg" />
                                    </div>
                                    <div className="coin absolute inset-0">
                                      <div className="side heads">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                      <div className="side tails">
                                        <Image
                                          src="/image/gamebetCrown.svg"
                                          alt="My image"
                                          width={200}
                                          height={256}
                                          className="w-auto h-auto "
                                        />
                                      </div>
                                    </div>
                                    <div className="absolute top-32 left-24">
                                      <hr className="w-10 text-start justify-start items-start border-2 rounded-lg" />
                                      <hr className="w-12 text-start justify-start items-start mt-2 border-2 rounded-lg" />
                                    </div>
                                  </div>
                                  {/* AMOUNT TO BET */}
                                  <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
                                    15,000
                                  </h1>
                                </div>
                              </div>
                              <div className="front">
                                <div className="img">
                                  <div className="circle "></div>
                                  <div className="circle " id="right"></div>
                                  <div className="circle " id="bottom"></div>
                                </div>

                                <div className="front-content">
                                  <small className="badge">Regular</small>
                                  <div className="items-center justify-center  flex">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleButtonClickLive(15000)
                                      }
                                    >
                                      <strong className="font-bold text-xl">
                                        Play Now
                                      </strong>
                                      <div id="container-stars">
                                        <div id="stars"></div>
                                      </div>

                                      <div id="glow">
                                        <div className="circle "></div>
                                        <div className="circle "></div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.section>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default GameBet;
