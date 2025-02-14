"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const cardVariants = {
  hidden: { opacity: 0, rotateX: 180, y: 50 },
  visible: (i) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  }),
  exit: (i) => ({
    opacity: 0,
    rotateX: -180,
    y: 50,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

export default function TabbedCardInterface() {
  const [activeTab, setActiveTab] = useState("vip");

  const handleButtonClickLive = (amount) => {
    console.log(`Bet amount: ${amount}`);
    // Add your logic here
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center mb-8">
        <TabButton
          active={activeTab === "vip"}
          onClick={() => setActiveTab("vip")}
        >
          VIP
        </TabButton>
        <TabButton
          active={activeTab === "regular"}
          onClick={() => setActiveTab("regular")}
        >
          REGULAR
        </TabButton>
      </div>
      <AnimatePresence mode="wait">
        {activeTab === "vip" ? (
          <motion.section
            key="vip"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-3 "
          >
            {[100000, 50000, 20000].map((amount, index) => (
              <motion.div key={index} custom={index} variants={cardVariants}>
                <Card
                  amount={amount}
                  category="VIP"
                  onClick={() => handleButtonClickLive(amount)}
                />
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <motion.section
            key="regular"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-3"
          >
            {[15000, 10000, 5000].map((amount, index) => (
              <motion.div key={index} custom={index} variants={cardVariants}>
                <Card
                  amount={amount}
                  category="Regular"
                  onClick={() => handleButtonClickLive(amount)}
                />
              </motion.div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-lg font-bold rounded-full mx-2 transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg transform scale-110"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ amount, category, onClick }) {
  return (
    <div
      className={`card transform ${
        category === "VIP" ? "skew-x-[5deg]" : "skew-x-[-5deg]"
      }`}
    >
      <div className="content">
        <div className="back">
          <div
            className={`back-content bg-gradient-to-b ${getGradient(amount)}`}
          >
            <div
              className={`shadow-lg rounded-full w-32 h-32 relative mt-5 bg-gradient-to-b ${getGradient(
                amount
              )}`}
            >
              {/* Crown image and decorative lines */}
              <div className="coin absolute inset-0">
                <div className="side heads">
                  <Image
                    src="/image/gamebetCrown.svg"
                    alt="Crown"
                    width={200}
                    height={256}
                    className="w-auto h-auto"
                  />
                </div>
                <div className="side tails">
                  <Image
                    src="/image/gamebetCrown.svg"
                    alt="Crown"
                    width={200}
                    height={256}
                    className="w-auto h-auto"
                  />
                </div>
              </div>
              {/* Decorative lines */}
            </div>
            <h1 className="font-black text-4xl text-[#FADD00] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_black]">
              {amount.toLocaleString()}
            </h1>
          </div>
        </div>
        <div className="front">
          <div className="img">
            <div className="circle"></div>
            <div className="circle" id="right"></div>
            <div className="circle" id="bottom"></div>
          </div>
          <div className="front-content">
            <small className="badge">{category}</small>
            <div className="items-center justify-center flex">
              <button type="button" className="btn" onClick={onClick}>
                <strong className="font-bold text-xl">Play Now</strong>
                <div id="container-stars">
                  <div id="stars"></div>
                </div>
                <div id="glow">
                  <div className="circle"></div>
                  <div className="circle"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGradient(amount) {
  switch (amount) {
    case 100000:
      return "from-[#CCCCCC] to-[#737373]";
    case 50000:
      return "from-[#BFBA16] to-[#737373]";
    case 20000:
      return "from-[#1B94A9] to-[#737373]";
    case 15000:
      return "from-[#A61212] to-[#737373]";
    case 10000:
      return "from-[#B88142] to-[#737373]";
    case 5000:
      return "from-[#93259D] to-[#737373]";
    default:
      return "from-gray-400 to-gray-600";
  }
}
