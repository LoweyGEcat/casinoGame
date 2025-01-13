"use client";
import React, { useState,useEffect } from "react";
import Image from "next/image";
import PercentageLoader from "../components/PercentageLoad";
import CrystalSnowAnimation from "../components/snowflakes";
import { useRouter } from 'next/navigation';

function TogitsGame() {
  const [isFinished, setIsFinished] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/TongitsGame/play-bot');
  };

  const handleButtonClickLive = () => {
    router.push('/TongitsGame/Gamebet');
  };
  

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render a fallback while ensuring client-side rendering
  }

  return (
    <div>
      {!isFinished ? (
        <PercentageLoader setIsFinished={setIsFinished} />
      ) : (
        <div className="w-full h-full relative">
          <div className=" inset-0 flex items-center justify-center z-50 h-[91vh]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(8, 14, 129, 0.8) 25%, rgba(37, 79, 100, 0.8) 44%)",
                zIndex: -1, // Send it to the background
              }}
            ></div>
            <div className="left-5 absolute top-5">
              <div className="flex flex-row gap-3">
                <div>
                  <button>
                    <Image
                      src="/image/contactUs.svg"
                      alt="My image"
                      width={40} // You need to specify width and height
                      height={40} // You need to specify width and height
                    />
                  </button>
                </div>
                <div>
                  <button>
                    {" "}
                    <Image
                      src="/image/settings.svg"
                      alt="My image"
                      width={40} // You need to specify width and height
                      height={40} // You need to specify width and height
                    />
                  </button>
                </div>
                <div>
                  <button>
                    {" "}
                    <Image
                      src="/image/question.svg"
                      alt="My image"
                      width={40} 
                      height={40} 
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[30rem] text-center">
              <div className="py-10">
                <Image
                  src="/image/svg_land.svg"
                  alt="Gon Portrait"
                  className="slow-high-bounce"
                  width={500} // You need to specify width and height
                  height={500} // You need to specify width and height
                />
              </div>
              <div
                className="justify-between overflow-hidden flex flex-col gap-10 stroke-1 text-white stroke-black font-black text-2xl landing"
                style={{
                  WebkitTextStroke: "0.5px black",
                  textStroke: "0.5px black", 
                }}
              >
                <div className="w-auto">
                <h3 className="bg-clip-text text-transparent bg-text-gradient text-4xl font-bold">Choose Your Game Mode</h3>
                <div className="flex flex-row gap-5 justify-center ">
                  {/* Remove bot Botton */}
                  {/* <div>
                    <button className="bg-[url('/image/playbotButton.svg')]  bg-no-repeat bg-cover bg-center" onClick={handleButtonClick}>
                    <p    className="text-4xl font-bold tracking-tight text-transparent text-stroke text-white">Play with bot</p>
                    </button>
                  </div> */}
                  <div>
                  <button className="bg-[url('/image/playbotButton.svg')]  bg-no-repeat bg-cover bg-center" onClick={handleButtonClickLive}>
                    <p    className="text-4xl font-bold tracking-tight text-transparent text-stroke text-white">Start Game</p>
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-screen h-16 relative flex justify-center items-center wood">
            <div
              className="absolute flex flex-row gap-2"
              style={{
                WebkitTextStroke: "0.5px black",
                textStroke: "0.5px black", // Fallback
              }}
            >
              <input type="checkbox" id="acceptTerms" />
              <p>Accept Terms and Condition</p>
            </div>
            <img
              src="/image/wood.svg"
              alt="My image"
              className="w-full h-auto"
            />
          </div>
          <CrystalSnowAnimation />
        </div>
      )}
    </div>
  );
}

export default TogitsGame;
