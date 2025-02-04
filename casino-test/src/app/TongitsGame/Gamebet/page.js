"use client";
import React, { useState } from "react";
import NetworkStatus from "@/app/components/NetworkStatus";
import { useRouter } from "next/navigation";
import Image from "next/image";

function GameBet() {
  const [bet, setBet] = useState();
  const router = useRouter();
  const handleButtonClickLive = () => {
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
      <button onClick={exitGamebet}>
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
      {/* <div className="absolute w-screen h-16 top-0 bg-user-name">
        <div className="w-full h-auto flex justify-center items-center">
          <div className="flex flex-col">
            <div className="flex justify-between flex-row items-center px-24 w-screen">
              <div>
                <Image
                  src="/image/vipGamebet.svg"
                  alt="My image"
                  width={200}
                  height={256}
                  className="w-auto h-64"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </div>
              <div>
                <Image
                  src="/image/gamebetCrown.svg"
                  alt="My image"
                  width={200}
                  height={256}
                  className="w-auto h-auto slow-high-bounce"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </div>
              <div>
                <Image
                  src="/image/gameberRegular.svg"
                  alt="My image"
                  width={200}
                  height={224}
                  className="w-auto h-56"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between flex-row px-24 gap-10 w-screen">
              <div>
                <button
                  onClick={() => {
                    handleClick(0);
                    setBet(100000);
                  }}
                >
                  <Image
                    src="/image/gamebet100.svg"
                    alt="My image"
                    width={200}
                    height={224}
                    className={`w-auto h-56 transition-transform ease-in-out duration-300 ${
                      activeIndex === 0
                        ? "transform translate-y-[-10px] scale-110"
                        : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    handleClick(1);
                    setBet(50000);
                  }}
                >
                  <Image
                    src="/image/gamebet50.svg"
                    alt="My image"
                    width={200}
                    height={224}
                    className={`w-auto h-56 transition-transform ease-in-out duration-300 ${
                      activeIndex === 1
                        ? "transform translate-y-[-10px] scale-110"
                        : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    handleClick(2);
                    setBet(20000);
                  }}
                >
                  <Image
                    src="/image/gamebet20.svg"
                    alt="My image"
                    width={200}
                    height={224}
                    className={`w-auto h-56 transition-transform ease-in-out duration-300 ${
                      activeIndex === 2
                        ? "transform translate-y-[-10px] scale-110"
                        : ""
                    }`}
                  />
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    handleClick(3);
                    setBet(2000);
                  }}
                >
                  <Image
                    src="/image/gamebet2.svg"
                    alt="My image"
                    width={200}
                    height={224}
                    className={`w-auto h-56 transition-transform ease-in-out duration-300 ${
                      activeIndex === 3
                        ? "transform translate-y-[-10px] scale-110"
                        : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    handleClick(4);
                    setBet(5000);
                  }}
                >
                  <Image
                    src="/image/gamebet5.svg"
                    alt="My image"
                    width={200}
                    height={224}
                    className={`w-auto h-56 transition-transform ease-in-out duration-300 ${
                      activeIndex === 4
                        ? "transform translate-y-[-10px] scale-110"
                        : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    handleClick(5);
                    setBet(10000);
                  }}
                >
                  <Image
                    src="/image/gamebet10.svg"
                    alt="My image"
                    width={200}
                    height={224}
                    className={`w-auto h-56 transition-transform ease-in-out duration-300 ${
                      activeIndex === 5
                        ? "transform translate-y-[-10px] scale-110"
                        : ""
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="w-full flex items-center justify-center py-16">
              <button onClick={handleButtonClickLive}>
                <Image
                  src="/image/gamebetQuickplay.svg"
                  alt="My image"
                  width={208}
                  height={104}
                  className="w-52 h-auto"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div> */}
      <div
        className="w-full h-40 aspect-w-16 aspect-h-9  bg-black
     sm:aspect-w-4 sm:aspect-h-3 
     md:aspect-w-16 md:aspect-h-9
     landscape:aspect-w-21 landscape:aspect-h-9 
     portrait:aspect-w-4 portrait:aspect-h-3"
      >
        <a
          href="#"
          class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
        </a>
      </div>
    </div>
  );
}

export default GameBet;
