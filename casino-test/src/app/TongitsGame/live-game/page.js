/* eslint-disable @next/next/no-img-element */
// src/app/TongitsGame/live-game/page.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { PlayerHand } from "../play-bot/PlayerHand";
import { Deck } from "../play-bot/Deck";
import { DiscardPile } from "../play-bot/DiscardPile";
import { MeldedCards } from "../play-bot/MeldedCards";
import NetworkStatus from "@/app/components/NetworkStatus";
import Sidebar from "@/app/components/Sidebar";
import ScoreDashboard from "@/app/components/ScoreDashboard";
import ChatSideBar from "@/app/components/ChatSideBar";
import DealingAnimation from "@/app/components/DealingCard";
import Bet from "@/app/components/Bet";
import Discardpile from "@/app/components/Discardpile";
import PlayerPoints from "@/app/components/PlayerPoints";
import GameHeaderPot from "@/app/components/gameHeaderPot";
import GameRound from "@/app/components/GameRound";
import GameFooter from "@/app/components/GameFooter";
import { motion } from "framer-motion";
import Image from "next/image";
import { calculateCardPoints } from "@/utils/card-utils";

let socket;

export default function LiveGame() {
  const [gameState, setGameState] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(true);
  const [isDealingDone, setIsDealingDone] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDiscardPileOpen, setIsDiscardPileOpen] = useState(false);
  const [selectedSapawTarget, setSelectedSapawTarget] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [discardingIndex, setDiscardingIndex] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("game-state", (newGameState) => {
      setGameState(newGameState);
      if (newGameState.players.length === 3 && !isDealingDone) {
        setTimeout(() => setIsDealingDone(true), 2000);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError("Failed to connect to the game server. Please try again later.");
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const joinGame = () => {
    if (playerName) {
      socket.emit("join-game", playerName);
      setIsJoining(false);
    }
  };

  const handleAction = useCallback(
    (action) => {
      if (gameState && socket) {
        if (action.type === "draw") {
          socket.emit("player-action", {
            ...action,
            meldIndices: action.meldIndices || [], // Pass meld indices to server
          });
        } else if (action.type === "discard" && selectedIndices.length === 1) {
          setDiscardingIndex(selectedIndices[0]);
          setTimeout(() => {
            socket.emit("player-action", action);
            setSelectedIndices([]);
            setDiscardingIndex(null);
          }, 400);
        } else {
          socket.emit("player-action", action);
        }
      }
    },
    [gameState, selectedIndices]
  );

  const handleCardClick = useCallback(
    (index) => {
      if (
        gameState &&
        !gameState.gameEnded &&
        gameState.currentPlayerIndex === 0
      ) {
        const newSelectedIndices = gameState.selectedCardIndices.includes(index)
          ? gameState.selectedCardIndices.filter((i) => i !== index)
          : [...gameState.selectedCardIndices, index];
        updateSelectedCardIndices(newSelectedIndices);
        setSelectedIndices(newSelectedIndices);
      }
    },
    [gameState]
  );

  const handleDiscard = useCallback(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex === 0 &&
      gameState.selectedCardIndices.length === 1 &&
      !gameState.gameEnded
    ) {
      const indexToDiscard = selectedIndices[0];
      setDiscardingIndex(indexToDiscard);

      setTimeout(() => {
        discardCard(gameState.selectedCardIndices[0]);
        setSelectedIndices([]);
        updateSelectedCardIndices([]);
        setDiscardingIndex(null);
      }, 400);
    }
  }, [gameState, selectedIndices]);

  const handleMeld = useCallback(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex === 0 &&
      gameState.selectedCardIndices.length >= 3 &&
      !gameState.gameEnded
    ) {
      meldCards(gameState.selectedCardIndices);
      // Clear selected indices after melding
      updateSelectedCardIndices([]);
      setSelectedIndices([]);
    }
  }, [gameState]);

  const handleSapaw = useCallback(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex ===
        gameState.players.findIndex((p) => p.id === socket.id) &&
      selectedSapawTarget &&
      selectedIndices.length > 0 &&
      !gameState.gameEnded
    ) {
      handleAction({
        type: "sapaw",
        target: selectedSapawTarget,
        cardIndices: selectedIndices,
      });
      setSelectedSapawTarget(null);
    }
  }, [gameState, selectedSapawTarget, selectedIndices, handleAction]);

  const handleCallDraw = useCallback(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex ===
        gameState.players.findIndex((p) => p.id === socket.id) &&
      !gameState.gameEnded &&
      gameState.players[gameState.currentPlayerIndex].exposedMelds.length > 0 &&
      gameState.hasDrawnThisTurn
    ) {
      handleAction({ type: "callDraw" });
    }
  }, [gameState, handleAction]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleDiscardPile = () => setIsDiscardPileOpen(!isDiscardPileOpen);

  const animateClick = () => {
    setScale(0.99);
    setTimeout(() => setScale(1), 300);
  };

  if (isJoining) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Join Tongits Game</h1>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={joinGame}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Join Game
          </button>
        </div>
      </div>
    );
  }

  if (!isDealingDone) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[url('/image/TableBot.svg')] bg-no-repeat bg-cover bg-center relative">
        <DealingAnimation onComplete={() => setIsDealingDone(true)} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!gameState) {
    return <div>Loading game state...</div>;
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isPlayerTurn =
    gameState.currentPlayerIndex ===
    gameState.players.findIndex((p) => p.id === socket.id);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[url('/image/TableBot.svg')] bg-no-repeat bg-cover bg-center relative">
      <div className="absolute w-screen h-16 top-0 bg-custom-gradient">
        <div className="flex flex-row h-full w-full justify-between">
          <button onClick={toggleSidebar}>
            <img
              onClick={animateClick}
              src="/image/sideBarButton.svg"
              alt="Sidebar"
              className="w-full h-full"
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </button>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <NetworkStatus />
        </div>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <GameHeaderPot gameState={gameState} />
      </div>
      <div className="flex w-full max-w-7xl gap-4">
        <div className="w-full flex flex-col justify-between items-center gap-10">
          <div>
            <div
              className="p-4 2xl:px-8 rounded-md flex justify-center space-x-2 mb-10 mt-3 relative"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 40, 56, 0.2), rgba(122, 210, 175, 0.2))",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Deck
                  cardsLeft={gameState.deck.length}
                  onDraw={() =>
                    isPlayerTurn &&
                    !gameState.gameEnded &&
                    handleAction({ type: "draw", fromDeck: true })
                  }
                  disabled={
                    gameState.hasDrawnThisTurn ||
                    !isPlayerTurn ||
                    gameState.gameEnded
                  }
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DiscardPile
                  topCard={
                    gameState.discardPile[gameState.discardPile.length - 1]
                  }
                  onDraw={(fromDeck, meldIndices) =>
                    isPlayerTurn &&
                    !gameState.gameEnded &&
                    handleAction({ type: "draw", fromDeck, meldIndices })
                  }
                  disabled={
                    gameState.hasDrawnThisTurn ||
                    !isPlayerTurn ||
                    gameState.gameEnded
                  }
                  setPosition={setPosition}
                  currentPlayer={
                    gameState.players[gameState.currentPlayerIndex]
                  }
                />
              </motion.div>
              <Discardpile
                discardCard={gameState.discardPile}
                isOpen={isDiscardPileOpen}
                onClose={() => setIsDiscardPileOpen(false)}
              />
              <button
                className="absolute -right-3 top-12 text-white text-xl"
                onClick={toggleDiscardPile}
              >
                <div className="w-full h-10">
                  <Image
                    src="/image/viewdiscardButton.svg"
                    alt="View Discard"
                    width={1000}
                    height={1000}
                    className="w-5 h-5 animate-pulse"
                    style={{
                      transform: `scale(${scale})`,
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
          <div className="absolute top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Bet bet={gameState.entryFee} />
          </div>
          <div>
            <div className="pb-24 pr-20 2xl:py-24 2xl:pr-0">
              <PlayerHand
                position={position}
                cardSize={" w-1.5 h-22 p-2 text-4xl"}
                hand={gameState.players.find((p) => p.id === socket.id)?.hand}
                onCardClick={handleCardClick}
                selectedIndices={selectedIndices}
                isCurrentPlayer={isPlayerTurn && !gameState.gameEnded}
                discardingIndex={discardingIndex}
              />
            </div>
          </div>
        </div>
        <div className="absolute">
          <div className="h-[calc(100vh-8rem)] overflow-y-auto justify-center flex items-center">
            <div className="p-4">
              <MeldedCards
                cardSize={"w-16 h-22  text-3xl"}
                players={gameState.players}
                onSapawSelect={(target) => setSelectedSapawTarget(target)}
                currentPlayerIndex={gameState.currentPlayerIndex}
                selectedSapawTarget={selectedSapawTarget}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <button className="absolute bottom-0 left-96 2xl:left-[36rem] transform translate-x-1/2 mb-4">
          <img
            onClick={animateClick}
            src="/image/userBorder.svg"
            alt="User Border"
            className="w-30 h-36 2xl:h-40"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
        <button onClick={toggleChat}>
          <img
            onClick={animateClick}
            src="/image/chatButton.svg"
            alt="Chat"
            className="w-24 h-24 absolute right-2 2xl:right-10 bottom-28"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
        <ChatSideBar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        <div className="absolute right-0 bottom-64 w-24 h-24 ">
          <PlayerPoints
            gameState={gameState}
            getCardValue={calculateCardPoints}
          />
        </div>
        <div className="absolute left-5 bottom-64">
          <GameRound gameState={gameState} />
        </div>
        <div className="px-16 2xl:px-36 flex w-screen items-center gap-11 h-32 absolute bottom-0 left-0 justify-between">
          <div className="space-x-3">
            <button
              onClick={handleMeld}
              disabled={
                !isPlayerTurn ||
                selectedIndices.length < 3 ||
                !gameState.hasDrawnThisTurn ||
                gameState.gameEnded
              }
            >
              <img
                onClick={animateClick}
                src="/image/dropButton.svg"
                alt="Meld"
                className="w-[115px] 2xl:w-[145px] h-full"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
            <button
              onClick={handleDiscard}
              disabled={
                !isPlayerTurn ||
                selectedIndices.length !== 1 ||
                !gameState.hasDrawnThisTurn ||
                gameState.gameEnded
              }
            >
              <img
                onClick={animateClick}
                src="/image/dumpButton.svg"
                alt="Discard"
                className="w-[115px] 2xl:w-[145px] h-full"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
            <button
              onClick={handleSapaw}
              disabled={
                !isPlayerTurn ||
                !selectedSapawTarget ||
                selectedIndices.length === 0 ||
                !gameState.hasDrawnThisTurn ||
                gameState.gameEnded
              }
            >
              <img
                src="/image/sapawButton.svg"
                alt="Sapaw"
                className="w-[115px] 2xl:w-[145px] h-full"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
            <button
              onClick={handleCallDraw}
              disabled={
                !isPlayerTurn ||
                selectedIndices.length < 3 ||
                !gameState.hasDrawnThisTurn ||
                gameState.gameEnded
              }
            >
              <img
                onClick={animateClick}
                src="/image/fightButton.svg"
                alt="Call Draw"
                className="w-[115px] 2xl:w-[145px] h-full"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
          </div>
          <div className="h-full flex gap-1 justify-center items-center ">
            <button onClick={() => handleAction({ type: "autoSort" })}>
              <img
                onClick={animateClick}
                src="/image/auoSort.svg"
                alt="Auto Sort"
                className="w-32 h-32"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
            <button onClick={() => handleAction({ type: "shuffle" })}>
              <img
                onClick={animateClick}
                src="/image/shuffleButton.svg"
                alt="Shuffle"
                className="w-32 h-32"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
            <button onClick={() => handleAction({ type: "withdraw" })}>
              <img
                onClick={animateClick}
                src="/image/withdrawButton.svg"
                alt="Withdraw"
                className="w-36 h-32"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
            <button onClick={() => handleAction({ type: "deposit" })}>
              <img
                onClick={animateClick}
                src="/image/depositButton.svg"
                alt="Deposit"
                className="w-36 h-32"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </button>
          </div>
        </div>
      </div>
      {gameState.gameEnded && (
        <ScoreDashboard
          gameState={gameState}
          onClose={() => handleAction({ type: "nextGame" })}
          Reset={() => handleAction({ type: "nextGame" })}
        />
      )}
    </div>
  );
}
