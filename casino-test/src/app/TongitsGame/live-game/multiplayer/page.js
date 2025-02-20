"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import io from "socket.io-client";
import GameHeaderPot from "@/app/components/gameHeaderPot";
import { PlayerHand } from "../../play-bot/PlayerHand";
import { MeldedCards } from "../../play-bot/MeldedCards";
import { Deck } from "../../play-bot/Deck";
import { DiscardPile } from "../../play-bot/DiscardPile";
import GameFooter from "@/app/components/GameFooter";
import DealingAnimation from "@/app/components/DealingCard";
import Sidebar from "@/app/components/Sidebar";
import ChatSideBar from "@/app/components/ChatSideBar";
import ScoreDashboard from "@/app/components/ScoreDashboard";
import GameRound from "@/app/components/GameRound";
import Discardpile from "@/app/components/Discardpile";
import Image from "next/image";
import { isValidMeld } from "@/utils/card-utils";
import { useSearchParams, useRouter } from "next/navigation";
import CircularCountdown from "@/app/components/CircularCountdown";
import ActionText from "@/app/components/ActionText";
import FightModal from "@/app/components/FightChallengeModal";
import ChallengeModal from "@/app/components/ChanllengeModal";
import { Card } from "../../play-bot/Card";
import AudioControls from "@/app/components/AudioControls";
import DeclareWar from "@/app/components/declare-fight";

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [isWaiting, setIsWaiting] = useState(true);
  const [playersCount, setPlayersCount] = useState(0);
  const [error, setError] = useState(null);
  const [isDealingDone, setIsDealingDone] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDiscardPileOpen, setIsDiscardPileOpen] = useState(false);
  const [selectedSapawTarget, setSelectedSapawTarget] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [discardingIndex, setDiscardingIndex] = useState(null);
  const [isScoreboardVisible, setIsScoreboardVisible] = useState(false);
  const [paramValue, setParamValue] = useState();
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFightModalOpen, setIsFightModalOpen] = useState(false);
  const [fightInitiator, setFightInitiator] = useState(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeInitiator, setChallengeInitiator] = useState(null);
  const [challengeTarget, setChallengeTarget] = useState(null);
  const [drawnCardDisplay, setDrawnCardDisplay] = useState(null); // Added state variable
  const [drawnCard, setDrawnCard] = useState(null);
  const [showDrawnCardModal, setShowDrawnCardModal] = useState(false); // Added state variable
  const [counter, setCounter] = useState(0);
  const [enableFight, setEnableFight] = useState(false);
  const [isCurrentPlayerSapawTarget, setIsCurrentPlayerSapawTarget] =
    useState(false);
  const [sapawCounter, setSapawCounter] = useState(1);
  const [selectedCard, setSelectedCard] = useState(false);
  const [meld, setMeld] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const hasIncremented = useRef(false);

  const [timer, setTimer] = useState(30);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef(null);
  const previousPlayerIndexRef = useRef(null);
  const hasProcessedTurnEnd = useRef(false);

  useEffect(() => {
    const value = searchParams.get("betAmount");
    if (!value) {
      router.push("/TongitsGame/Gamebet");
    }
    setParamValue(value);
  }, [searchParams, router]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("player-joined", (data) => {
      setPlayersCount(data.playersCount);
      if (data.playersCount < 3) {
        setIsWaiting(true);
      }
    });

    newSocket.on("game-started", () => {
      setIsWaiting(false);
      setGameStarted(true);
      if (!isDealingDone) {
        setIsDealingDone(false);
        setTimeout(() => setIsDealingDone(true), 2000);
      }
    });

    newSocket.on("game-state", (newGameState) => {
      setGameState(newGameState);

      // Update drawn card state
      if (newGameState.drawnCardVisible && newGameState.drawnCard) {
        setDrawnCard(newGameState.drawnCard);
        setShowDrawnCardModal(true); // Show modal when drawn card is visible
      } else {
        setDrawnCard(null);
        setShowDrawnCardModal(false); // Hide modal when drawn card is not visible
      }

      if (newGameState.lastAction) {
        setCurrentAction(
          `Players ${newGameState.lastAction.player} ${newGameState.lastAction.type}`
        );
      }
    });

    newSocket.on("player-left", (data) => {
      setPlayersCount(data.playersCount);
      if (data.playersCount < 3) {
        setIsWaiting(true);
      }
    });

    newSocket.on("fight-initiated", (data) => {
      setFightInitiator(data.initiator);
      setIsFightModalOpen(true);
    });

    newSocket.on("fight-response-received", (data) => {
      setCurrentAction(
        `${data.responder} has ${
          data.accepted ? "accepted" : "declined"
        } the fight.`
      );
    });

    newSocket.on("fight-resolved", (data) => {
      setIsFightModalOpen(false);
      if (data.winner) {
        setCurrentAction(`${data.winner} won the fight!`);
      } else {
        setCurrentAction(`The fight was declined.`);
      }
    });

    newSocket.on("challenge-initiated", (data) => {
      setChallengeInitiator(data.initiator);
      setChallengeTarget(data.target);
      setIsChallengeModalOpen(true);
    });

    newSocket.on("challenge-resolved", (data) => {
      setIsChallengeModalOpen(false);
      setCurrentAction(`${data.winner} won the challenge!`);
    });

    newSocket.on("connect_error", (err) => {
      setError("Failed to connect to game server");
      console.error("Connection error:", err);
    });

    newSocket.on("timer-update", (timer) => {
      setTimer(timer);
    });

    if (!socket) return;
    // create game-reset
    socket.on("game-reset", ({ newGameId, message }) => {
      // Reset all game state except playersCount
      setGameState(null);
      setIsWaiting(true);
      setGameStarted(false);
      setIsDealingDone(false);
      setSelectedIndices([]);
      setDiscardingIndex(null);
      setSelectedSapawTarget(null);
      setIsAutoPlaying(false);
      setCurrentAction(null);
      setIsFightModalOpen(false);
      setIsChallengeModalOpen(false);
      setIsDiscardPileOpen(false);
      setIsScoreboardVisible(false);
      setTimer(30); // Reset timer
      setDrawnCardDisplay(null); // Reset drawnCardDisplay
      setDrawnCard(null); // Reset drawnCard
      setShowDrawnCardModal(false); // Hide drawn card modal

      // Re-join with the same player name
      if (playerName) {
        socket.emit("join-game", playerName);
      }
    });

    return () => {
      socket.off("game-reset");
      socket.off("game-started");
      socket.off("game-state");
      socket.off("timer-update");
      socket.off("player-joined");
      socket.off("player-disconnected");
      socket.off("fight-initiated");
      socket.off("fight-response-received");
      socket.off("fight-resolved");
    };
  }, []);

  useEffect(() => {
    const currentPlayerIndex = gameState?.currentPlayerIndex;
    const isPlayerTurn =
      gameState &&
      currentPlayerIndex ===
        gameState.players.findIndex((p) => p.id === socket?.id);

    if (!gameState?.gameEnded && isDealingDone) {
      // Reset timer only when the turn changes
      if (currentPlayerIndex !== previousPlayerIndexRef.current) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimer(30);
        setTimerExpired(false);
      }

      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer <= 1) {
              clearInterval(timerRef.current);
              timerRef.current = null;
              setTimerExpired(true);
              if (isPlayerTurn && !drawnCard) {
                handleAutoPlay();
              }
              return 40;
            }
            return prevTimer - 1;
          });
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimerExpired(false);
    }

    previousPlayerIndexRef.current = currentPlayerIndex;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, socket?.id, isDealingDone, drawnCard]);

  useEffect(() => {
    if (gameState?.gameEnded === true) {
      setCounter(1);
      setEnableFight(false);
      hasIncremented.current = true;

      if (gameState?.currentPlayerIndex !== undefined && gameState?.players) {
        const previousPlayerIndex =
          (gameState.currentPlayerIndex - 1 + gameState.players.length) %
          gameState.players.length;
        const previousPlayerId = gameState.players[previousPlayerIndex].id;

        if (previousPlayerId === socket?.id && !hasIncremented.current) {
          setCounter((prevCounter) => {
            const newCounter = prevCounter + 1;
            if (newCounter > 1) {
              setEnableFight(true);
            }
            return newCounter;
          });
          hasIncremented.current = true;
        } else if (previousPlayerId !== socket?.id) {
          hasIncremented.current = true;
        }
      }
    } else {
      if (gameState?.currentPlayerIndex !== undefined && gameState?.players) {
        const previousPlayerIndex =
          (gameState.currentPlayerIndex - 1 + gameState.players.length) %
          gameState.players.length;
        const previousPlayerId = gameState.players[previousPlayerIndex].id;

        if (previousPlayerId === socket?.id && !hasIncremented.current) {
          setCounter((prevCounter) => {
            const newCounter = prevCounter + 1;
            if (newCounter > 1) {
              setEnableFight(true);
            }
            return newCounter;
          });
          hasIncremented.current = true;
        } else if (previousPlayerId !== socket?.id) {
          hasIncremented.current = false;
        }
      }
    }
  }, [
    gameState?.currentPlayerIndex,
    gameState?.players,
    socket?.id,
    gameState?.gameEnded,
  ]);

  useEffect(() => {
    if (gameState && gameState.players && socket) {
      const player = gameState.players.find((p) => p.id === socket.id);

      if (player && isCurrentPlayerSapawTarget !== player.isSapawed) {
        setIsCurrentPlayerSapawTarget(player.isSapawed);
      }

      // Determine turn status
      const isCurrentPlayerTurn =
        gameState.currentPlayerIndex ===
        gameState.players.findIndex((p) => p.id === socket.id);
      const didTurnJustEnd = !isCurrentPlayerTurn && isCurrentPlayerSapawTarget;

      // Reset flag when player's turn starts
      if (isCurrentPlayerTurn) {
        hasProcessedTurnEnd.current = false;
      }

      // Increment logic (runs only once per valid turn end)
      if (didTurnJustEnd && !hasProcessedTurnEnd.current) {
        if (sapawCounter < 2) {
          setSapawCounter((prev) => prev + 1);
        } else if (sapawCounter === 2) {
          setSapawCounter(1);
          if (socket && socket.connected) {
            try {
              socket.emit("sapaw", { playerId: socket.id });
            } catch (error) {
              console.error("Error emitting sapaw event:", error);
            }
          } else {
            console.error("Socket is not connected");
          }
          setIsCurrentPlayerSapawTarget(player.isSapawed);
        } else {
          setSapawCounter((prev) => prev + 1);
        }
        hasProcessedTurnEnd.current = true;
      }
    }
  }, [gameState, socket?.id, isCurrentPlayerSapawTarget, sapawCounter]);

  const isAnimatingRef = useRef(false);
  const discardTimeoutRef = useRef(null);

  const handleAutoPlay = useCallback(() => {
    if (gameState && socket && !isAutoPlaying) {
      setIsAutoPlaying(true);

      // Auto draw from deck
      socket.emit("player-action", { type: "draw", fromDeck: true });

      setTimeout(() => {
        const currentPlayerHand = gameState.players.find(
          (p) => p.id === socket.id
        )?.hand;

        if (currentPlayerHand && currentPlayerHand.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * currentPlayerHand.length
          );

          if (!isAnimatingRef.current) {
            isAnimatingRef.current = true;
            setDiscardingIndex(randomIndex);

            discardTimeoutRef.current = setTimeout(() => {
              socket.emit("player-action", {
                type: "discard",
                cardIndex: randomIndex,
              });
              setDiscardingIndex(null);
              isAnimatingRef.current = false;
              setIsAutoPlaying(false);
            }, 400);
          }
        } else {
          setIsAutoPlaying(false);
        }
      }, 500);
    }
  }, [gameState, socket, isAutoPlaying]);

  const handleJoinGame = (e) => {
    e?.preventDefault();
    if (playerName.trim() && socket) {
      console.log("Joining game with name:", playerName);
      socket.emit("join-game", playerName);
    }
  };

  const nextRound = () => {
    handleAction({ type: "nextGame" });
  };

  const handleAction = useCallback(
    (action) => {
      if (gameState && socket) {
        if (action.type === "autoSort") {
          // Allow auto-sort for the current player at any time
          const playerIndices = [socket.id];
          socket.emit("player-action", {
            type: "autoSort",
            playerIndices: playerIndices,
            requestingPlayerId: socket.id,
          });
        } else if (action.type === "discard" && selectedIndices.length === 1) {
          setDiscardingIndex(selectedIndices[0]);
          setTimeout(() => {
            socket.emit("player-action", action);
            setSelectedIndices([]);
            setDiscardingIndex(null);
          }, 300);
        } else if (action.type === "shuffle") {
          const playerIndices = [socket.id];
          socket.emit("player-action", {
            type: "shuffle",
            playerIndices: playerIndices,
            requestingPlayerId: socket.id,
          });
        } else if (action.type === "fight") {
          socket.emit("player-action", { type: "fight" });
          setIsFightModalOpen(true);
        } else if (action.type === "challenge") {
          socket.emit("player-action", {
            type: "challenge",
            targetIndex: action.targetIndex,
          });
        } else {
          socket.emit("player-action", action);
        }
      }
    },
    [gameState, socket, selectedIndices]
  );

  const handleFightResponse = (accept) => {
    if (gameState && socket) {
      socket.emit("player-action", { type: "fight-response", accept });
    }
    setIsFightModalOpen(false);
  };

  const handleChallengeResponse = (accept) => {
    if (gameState && socket) {
      socket.emit("player-action", { type: "challenge-response", accept });
    }
    setIsChallengeModalOpen(false);
  };

  const canDrawFromDiscard = useCallback(() => {
    try {
      if (!gameState || gameState.discardPile.length === 0) return false;
      const topDiscardCard =
        gameState.discardPile[gameState.discardPile.length - 1];
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];

      for (let i = 0; i < currentPlayer?.hand.length; i++) {
        for (let j = i + 1; j < currentPlayer?.hand.length; j++) {
          if (
            isValidMeld([
              topDiscardCard,
              currentPlayer?.hand[i],
              currentPlayer?.hand[j],
            ])
          ) {
            return true;
          }
        }
      }

      for (const meld of currentPlayer?.exposedMelds) {
        if (isValidMeld([...meld, topDiscardCard])) {
          return true;
        }
      }

      return false;
    } catch (error) {
      router.push("/TongitsGame/Gamebet");
    }
  }, [gameState, router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const animateClick = () => {
    setScale(0.99);
    setTimeout(() => setScale(1), 300);
  };

  const handleAcceptCard = () => {
    if (socket) {
      socket.emit("player-action", { type: "addDrawnCardToHand" });
    }
    setShowDrawnCardModal(false);
  };

  const handleDenyCard = () => {
    if (socket && drawnCard) {
      socket.emit("player-action", { type: "denyDrawnCard" });
      setDiscardingIndex(-1); // Use -1 to indicate the drawn card
      setTimeout(() => {
        setDiscardingIndex(null);
      }, 200);
    }
    setShowDrawnCardModal(false);
  };

  useEffect(() => {
    if (timerExpired && isPlayerTurn && drawnCard) {
      handleDenyCard();
    }
  }, [timerExpired, drawnCard]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleJoinGame}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Join Tongits Game</h2>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Join Game
          </button>
        </form>
      </div>
    );
  }

  if (isWaiting && playersCount < 3) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Waiting for Players</h2>
          <p className="mb-4">Players joined: {playersCount}/3</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (gameStarted && !isDealingDone) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[url('/image/tablegame2.svg')] bg-no-repeat bg-cover bg-center relative">
        <DealingAnimation onComplete={() => setIsDealingDone(true)} />
      </div>
    );
  }

  const DiscardPileModal = () => {
    setIsDiscardPileOpen(!isDiscardPileOpen);
  };

  const resetGame = () => {
    socket.emit("player-action", { type: "resetGame" });
    router.push(`/TongitsGame/Gamebet`);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const ContinueGame = () => {
    // Reset all relevant state variables except playersCount
    setGameState(null);
    setIsWaiting(true);
    setGameStarted(false);
    setIsDealingDone(false);
    setSelectedIndices([]);
    setDiscardingIndex(null);
    setSelectedSapawTarget(null);
    setIsAutoPlaying(false);
    setCurrentAction(null);
    setIsFightModalOpen(false);
    setIsChallengeModalOpen(false);
    setIsDiscardPileOpen(false);
    setIsScoreboardVisible(false);
    setTimer(30);
    setGameState(null);
    setIsFightModalOpen(false);
    setIsChallengeModalOpen(false);
    setIsDiscardPileOpen(false);
    setChallengeTarget(null);
    setPlayersCount(0);
    setDrawnCardDisplay(null); // Reset drawnCardDisplay
    setDrawnCard(null); // Reset drawnCard
    setShowDrawnCardModal(false); // Hide drawn card modal
    // ITO LANG MUNA APPROACH KO FOR NOW RESET NEXT GAME ENCOUNTER ERROR
    // IF WALA REFRESH NAIIWAN UNG MGA DATA KAHIT NAG RESET NA
    const value = searchParams.get("betAmount");
    router.push(`/TongitsGame/live-game/multiplayer?betAmount=20000`);
    window.location.reload();
    socket.emit("player-action", { type: "resetGame" });
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const playerIndex = gameState.players.findIndex((p) => p.id === socket.id);
  const player = gameState.players[playerIndex];
  const isPlayerTurn =
    gameState.currentPlayerIndex ===
    gameState.players.findIndex((p) => p.id === socket.id);

  console.log(player);
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[url('/image/tablegame2.svg')] bg-no-repeat bg-cover bg-center relative overflow-hidden">
      <header className="absolute top-0 flex flex-row justify-between w-full">
        <div className="shadow-lg border-2 border-[#FF7EA0] rounded-b-lg bg-gradient-to-b from-[#911638] via-[#911638] via-33% to-[#FF1C59] items-center flex justify-center p-3 rounded-bl-[20px] rounded-br-[20px] drop-shadow-[0px_4px_5px_white]">
          <label className="hamburger relative z-50">
            <input
              type="checkbox"
              checked={isSidebarOpen}
              onChange={toggleSidebar}
            />
            <svg viewBox="0 0 32 32">
              <path
                className="line line-top-bottom"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              ></path>
              <path className="line" d="M7 16 27 16"></path>
            </svg>
          </label>

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
        <div className="w-1/2">
          <GameHeaderPot
            betAmout={paramValue}
            gameState={gameState}
            socket={socket}
          />
        </div>
        <div className="shadow-lg border-2 border-[#FF7EA0] rounded-b-lg bg-gradient-to-b from-[#911638] via-[#911638] via-33% to-[#FF1C59] items-center flex justify-center p-5"></div>
      </header>

      <main>
        <div className="flex w-full max-w-7xl gap-4">
          <div className="w-full flex flex-col justify-between items-center gap-10 ">
            <div className="absolute z-10">
              <MeldedCards
                isPlayerTurn={isPlayerTurn}
                gameState={gameState}
                socket={socket.id}
                players={gameState.players}
                onSapawSelect={setSelectedSapawTarget}
                currentPlayerIndex={gameState.currentPlayerIndex}
                selectedSapawTarget={selectedSapawTarget}
                socketId={socket.id}
                game={gameState}
                ownPlayerIndex={playerIndex}
                timer={timer}
              />
            </div>

            <div className="flex flex-col w-60 items-center">
              <h1 className="font-black text-4xl text-center bg-gradient-to-r from-[#5EFF80] to-[#11CB39] text-transparent bg-clip-text drop-shadow-[2px_7px_2px_#044412] tracking-widest">
                Tong'iT TradisyonaL
              </h1>
              <div className="rounded-md flex justify-center relative bg-[rgba(0,0,0,0.4)] gap-2 mt-5 p-5 px-10">
                <Deck
                  cardsLeft={gameState.deck.length}
                  onDraw={() =>
                    isPlayerTurn &&
                    !gameState.gameEnded &&
                    handleAction({ type: "drawShow", fromDeck: true })
                  }
                  disabled={
                    gameState.hasDrawnThisTurn ||
                    !isPlayerTurn ||
                    gameState.gameEnded
                  }
                />
                {/* // todo make this a components */}
                {/* Show drawn card beside the deck */}
                {drawnCard && isPlayerTurn && (
                  <div className="absolute -left-32 top-10">
                    <div className="flex justify-center flex-col items-center">
                      <Card
                        card={drawnCard}
                        cardSize={"w-16 h-auto p-1 text-xl 2xl:text-lg"}
                      />
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={handleAcceptCard}
                          className="px-4 py-2 bg-green-500 rounded-full text-white  hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={handleDenyCard}
                          className="px-4 py-2 bg-red-500 rounded-full text-white  hover:bg-red-600"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <DiscardPile
                  currentPlayer={isPlayerTurn}
                  topCard={
                    gameState.discardPile[gameState.discardPile.length - 1]
                  }
                  onDraw={() =>
                    isPlayerTurn &&
                    !gameState.gameEnded &&
                    handleAction({ type: "draw", fromDeck: false })
                  }
                  disabled={
                    gameState.hasDrawnThisTurn ||
                    !isPlayerTurn ||
                    gameState.gameEnded ||
                    !canDrawFromDiscard()
                  }
                  canDraw={canDrawFromDiscard()}
                  setPosition={setPosition}
                />
                <Discardpile
                  discardCard={gameState.discardPile}
                  isOpen={isDiscardPileOpen}
                  onClose={() => setIsDiscardPileOpen(false)}
                  TextContent={"Card Dump"}
                />
                <button
                  className="absolute -right-3 top-12 text-white text-xl"
                  onClick={DiscardPileModal}
                >
                  <div className="w-full h-10">
                    <Image
                      onClick={animateClick}
                      src="/image/viewdiscardButton.svg"
                      alt="My image"
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

            <div className="pb-6 mt-10 pr-20 2xl:py-24 2xl:pr-0">
              <GameFooter
                timer={timer}
                onMeld={() => {
                  if (
                    isPlayerTurn &&
                    selectedIndices.length >= 3 &&
                    !gameState.gameEnded
                  ) {
                    setMeld(true);
                    setTimeout(() => {
                      setMeld(false);
                    }, 500);
                    handleAction({
                      type: "meld",
                      cardIndices: selectedIndices,
                    });
                  }
                  selectedIndices.length > 0 && setSelectedIndices([]);
                }}
                onDiscard={() => {
                  if (
                    isPlayerTurn &&
                    selectedIndices.length === 1 &&
                    !gameState.gameEnded
                  ) {
                    setDiscardingIndex(selectedIndices[0]);
                    setTimeout(() => {
                      handleAction({
                        type: "discard",
                        cardIndex: selectedIndices[0],
                      });
                      setSelectedIndices([]);
                      setDiscardingIndex(null);
                    }, 200);
                  }
                }}
                onSapaw={() => {
                  if (
                    isPlayerTurn &&
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
                  selectedIndices.length > 0 && setSelectedIndices([]);
                }}
                onCallDraw={() => {
                  if (
                    isPlayerTurn &&
                    !gameState.gameEnded &&
                    currentPlayer.exposedMelds.length > 0
                  ) {
                    handleAction({ type: "callDraw" });
                  }
                }}
                onFight={() => {
                  if (
                    (isPlayerTurn && !gameState.gameEnded) ||
                    !gameState.hasDrawnThisTurn
                  ) {
                    handleAction({ type: "fight" });
                  } else {
                    alert("You can't fight");
                  }
                }}
                onChallenge={() => {
                  if (isPlayerTurn && !gameState.gameEnded) {
                    // Open a modal to select which player to challenge
                    // For simplicity, we'll just challenge the next player
                    const targetIndex =
                      (gameState.currentPlayerIndex + 1) %
                      gameState.players.length;
                    handleAction({ type: "challenge", targetIndex });
                  }
                }}
                isPlayerTurn={isPlayerTurn}
                gameEnded={gameState.gameEnded}
                hasDrawnThisTurn={gameState.hasDrawnThisTurn}
                selectedIndices={selectedIndices}
                selectedSapawTarget={selectedSapawTarget}
                enableFight={enableFight}
                isSapawed={isCurrentPlayerSapawTarget}
                selectedCard={selectedCard}
                drawnCard={drawnCard}
                socket={socket}
                gameState={gameState}
              />
            </div>
          </div>
        </div>
      </main>

      <div className="absolute left-28 bottom-5">
        <div className="flex flex-col items-center ">
          <div className="bg-white rounded-full h-28 w-28 flex flex-col items-center relative">
            <CircularCountdown
              timer={timer}
              gameState={gameState}
              isPlayerTurn={isPlayerTurn}
            />

            {/* if player is talking this will be activated */}
            {/* <div className="absolute inset-0 rounded-full border-4 border-lime-500"></div> */}
          </div>
          {/* PLAYER NAME */}
          <h1 className="font-black text-xl text-white my-2 drop-shadow-[2px_3px_0px_black]">
            {player.name}
          </h1>
          {/* PLAYER BALANCE */}
          <div className="bg-[rgba(0,0,0,0.2)] flex flex-row items-center gap-2 py-2 rounded-full px-10">
            <Image
              src="/image/potbadge.svg"
              width={50}
              height={50}
              alt="Winner Crown"
              className="w-8 h-8"
            />
            <h2 className="font-black text-xl text-[#FFD653] drop-shadow-[2px_3px_0px_black]">
              2,000
            </h2>
          </div>
        </div>
      </div>

      <PlayerHand
        position={position}
        cardSize={" w-24 h-28 p-2 text-3xl"}
        contextText={" text-7xl"}
        hand={gameState.players.find((p) => p.id === socket.id)?.hand}
        onCardClick={(index) => {
          if (!gameState.gameEnded) {
            const newSelectedIndices = selectedIndices.includes(index)
              ? selectedIndices.filter((i) => i !== index)
              : [...selectedIndices, index];

            if (isValidMeld(newSelectedIndices.map((i) => player.hand[i]))) {
              setSelectedCard(true);
            } else {
              setSelectedCard(false);
            }

            // if(isValidMeld())
            setSelectedIndices(newSelectedIndices);
            setSelectedIndices(newSelectedIndices);
            handleAction({
              type: "updateSelectedIndices",
              indices: newSelectedIndices,
            });
          }
        }}
        selectedIndices={selectedIndices}
        isCurrentPlayer={isPlayerTurn && !gameState.gameEnded}
        discardingIndex={discardingIndex}
      />

      {gameState.gameEnded && (
        <ScoreDashboard
          ContinueGame={ContinueGame}
          socketId={socket.id}
          gameState={gameState}
          onClose={() => setIsScoreboardVisible(false)}
          Reset={nextRound}
          resetGame={resetGame}
          setPlayersCount={setPlayersCount}
        />
      )}

      <ChatSideBar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        socket={socket}
        gameId={gameState.id}
        playerIndex={playerIndex}
      />
      {currentAction && <ActionText action={currentAction} />}
      <FightModal
        isOpen={isFightModalOpen}
        onClose={() => setIsFightModalOpen(false)}
        onAccept={() => handleFightResponse(true)}
        onDecline={() => handleFightResponse(false)}
        initiator={fightInitiator}
        currentPlayer={player?.name}
      />

      {/* <ChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        onAccept={() => handleChallengeResponse(true)}
        onDecline={() => handleChallengeResponse(false)}
        initiator={challengeInitiator}
        target={challengeTarget}
      /> */}

      {socket && gameState && (
        <div className="absolute bottom-0 right-0">
          <div className="flex flex-col ">
            <div className="flex flex-row gap-2 justify-end items-end p-5">
              <button
                onClick={() => {
                  // Allow auto-sort for the current player only
                  const playerIndices = [socket.id];
                  handleAction({
                    type: "autoSort",
                    playerIndices: playerIndices,
                  });
                }}
                className="flex flex-col items-center shuffle_btn cursor-pointer"
              >
                <div className="rounded-full w-14 h-14 bg-gradient-to-t from-[rgba(231,100,0,0.5)] to-[rgba(255,158,83,0.5)] drop-shadow-[0px_4px_0px_rgba(231,100,0,0.4)] border-2 border-[rgba(255,159,86,0.5)] items-center justify-center flex">
                  <Image
                    onClick={animateClick}
                    src="/image/SORT.svg"
                    width={80}
                    height={80}
                    alt="Winner Crown"
                    className="w-10 h-10 drop-shadow-[0px_4px_0px_rgba(231,100,0,0.4)]"
                  />
                </div>
                <h1 className="font-black text-white drop-shadow-[2px_3px_0px_black]">
                  Sort
                </h1>
              </button>
              <button
                onClick={() => {
                  // Allow auto-sort for the current player only
                  const playerIndices = [socket.id];
                  handleAction({
                    type: "shuffle",
                    playerIndices: playerIndices,
                  });
                }}
                className="flex flex-col items-center shuffle_btn cursor-pointer"
              >
                <div className="rounded-full w-14 h-14 bg-gradient-to-t from-[rgba(231,100,0,0.5)] to-[rgba(255,158,83,0.5)] drop-shadow-[0px_4px_0px_rgba(231,100,0,0.4)] border-2 border-[rgba(255,159,86,0.5)] items-center justify-center flex">
                  <Image
                    onClick={animateClick}
                    src="/image/shuffle.svg"
                    width={80}
                    height={80}
                    alt="Winner Crown"
                    className="w-10 h-10 drop-shadow-[0px_4px_0px_rgba(231,100,0,0.4)]"
                  />
                </div>
                <h1 className="font-black text-white drop-shadow-[2px_3px_0px_black]">
                  Shuffle
                </h1>
              </button>
            </div>
            <div className=" p-4 gamefooter w-80 ">
              <div className="flex flex-row gap-3 items-center justify-end">
                <div className="rounded-full  flex items-center justify-center">
                  <div className="faq-button bg-gradient-to-t to-[#F0E53B] from-[#FFC300] z-50">
                    <div className="flex items-center justify-center">
                      <h1 className="font-bold text-3xl mb-1">🙂</h1>
                    </div>
                    {/* <div className="tooltip gap-1">
                      <button className=" bg-white  rounded-full p-2 px-3">
                        👍
                      </button>
                      <button className=" bg-white  rounded-full p-2 px-3">
                        👏🏻
                      </button>
                      <button className=" bg-white rounded-full p-2 px-3">
                        🎉
                      </button>
                      <button className=" bg-white  rounded-full p-2 px-3">
                        ✨
                      </button>
                      <button className=" bg-white  rounded-full p-2 px-3">
                        🙂
                      </button>
                    </div> */}
                  </div>
                </div>
                <button
                  className="chatBtn bg-gradient-to-t to-[#6BFF69] from-[#04E700]"
                  onClick={toggleChat}
                >
                  <svg
                    onClick={animateClick}
                    className="w-14 h-9"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.6em"
                    fill="white"
                    viewBox="0 0 1000 1000"
                    version="1.1"
                  >
                    <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
                  </svg>
                </button>
                <AudioControls roomId={gameState.id} socket={socket} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
