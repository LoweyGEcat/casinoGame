"use client";

import { useState, useEffect } from "react";

const PercentageLoader = ({ setIsFinished }) => {
  const [progress, setProgress] = useState(0);
  const [networkSpeed, setNetworkSpeed] = useState("fast"); // fast, medium, or slow
  const [isHydrated, setIsHydrated] = useState(false); // Ensure hydration
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500); // Adjust the interval to control the speed
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    setIsHydrated(true); // Mark the component as hydrated
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // Skip logic until hydration is complete

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (connection) {
      const determineSpeed = () => {
        if (connection.downlink < 1) setNetworkSpeed("slow");
        else if (connection.downlink < 3) setNetworkSpeed("medium");
        else setNetworkSpeed("fast");
      };
      determineSpeed();
      connection.addEventListener("change", determineSpeed);

      return () => connection.removeEventListener("change", determineSpeed);
    }
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return; // Skip logic until hydration is complete

    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          let increment;

          switch (networkSpeed) {
            case "slow":
              increment = 0.3;
              break;
            case "medium":
              increment = 0.7;
              break;
            case "fast":
              increment = 1;
              break;
            default:
              increment = 1;
              break;
          }

          const newProgress = Math.min(prev + increment, 100);

          if (newProgress === 100) {
            setTimeout(() => {
              setIsFinished(true);
            }, 500);
            clearInterval(interval);
          }

          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [progress, networkSpeed, setIsFinished, isHydrated]);

  if (!isHydrated) {
    return null; // Optionally, render a fallback or nothing until hydrated
  }

  return (
    <div className="inset-0 flex items-center justify-center bg-gradient-to-b from-[#1798CC] to-[#140950] h-screen z-40 relative">
      <div className="w-[30rem] text-center pb-10 flex flex-col gap-10">
        <div className="w-auto h-auto">
          <img
            src="/image/loadingImg.png"
            alt="My image"
            className="w-full h-auto "
          />
        </div>
        <div className=" flex justify-center items-center">
        <div className="mb-4 h-10 w-96 flex bg-[url('/image/loadingBackground.svg')]  bg-no-repeat bg-cover bg-center rounded-full overflow-hidden relative">
        <img
        src="/image/loadingBorder.svg"
        alt="My image"
        className="w-[27rem] h-auto  absolute bottom-56 z-50"
      />
          <div
            className="h-full bg-gradient-to-r from-[#1292E2] to-[#DC9797] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-jaro text-white font-extrabold text-3xl"
              style={{
                WebkitTextStroke: "0.5px black",
                textStroke: "0.5px black", // Fallback
              }}
            >
              LOADING{dots}
            </div>
          </div>
          {/* <div className=" bg-[url('/image/border.svg')] w-full"></div> */}
        </div>
        </div>
        <div className="text-2xl font-bold text-blue-600">{progress}%</div>
      </div>
    </div>
  );
};

export default PercentageLoader;
