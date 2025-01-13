"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import GameHeaderPot from '@/app/components/gameHeaderPot';
import { PlayerHand } from '../../play-bot/PlayerHand';
import { MeldedCards } from '../../play-bot/MeldedCards';
import { Deck } from '../../play-bot/Deck';
import { DiscardPile } from '../../play-bot/DiscardPile';
import GameFooter from '@/app/components/GameFooter';
import DealingAnimation from '@/app/components/DealingCard';
import Sidebar from '@/app/components/Sidebar';
import ChatSideBar from '@/app/components/ChatSideBar';
import ScoreDashboard from '@/app/components/ScoreDashboard';
import NetworkStatus from '@/app/components/NetworkStatus';
import { calculateCardPoints } from '@/utils/card-utils';
import GameRound from '@/app/components/GameRound';
import PlayerPoints from '@/app/components/PlayerPoints';
import Bet from '@/app/components/Bet';
import Discardpile from "@/app/components/Discardpile";
import Image from 'next/image';
import { isValidMeld} from "@/utils/card-utils";
import { useSearchParams, useRouter } from 'next/navigation';
import CircularCountdown from '@/app/components/CircularCountdown';
import ActionText from '@/app/components/ActionText';

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState('');
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

  const searchParams = useSearchParams();
  const router = useRouter()

  const [timer, setTimer] = useState(20);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const value = searchParams.get('betAmount');
    if(!value){
      router.push('/TongitsGame/Gamebet');
    }
    setParamValue(value);
  }, [searchParams,router]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('player-joined', (data) => {
      setPlayersCount(data.playersCount);
      if (data.playersCount < 3) {
        setIsWaiting(true);
      }
    });

    newSocket.on('game-started', () => {
      setIsWaiting(false);
      setIsDealingDone(false);
      setTimeout(() => setIsDealingDone(true), 2000);
    });

    newSocket.on('game-state', (newGameState) => {
      setGameState(newGameState);

      if(newGameState.lastAction){
        setCurrentAction(`Players ${newGameState.lastAction.player} ${newGameState.lastAction.type}`);
      }
    });

    newSocket.on('player-left', (data) => {
      setPlayersCount(data.playersCount);
      if (data.playersCount < 3) {
        setIsWaiting(true);
      }
    });

    newSocket.on('connect_error', (err) => {
      setError('Failed to connect to game server');
      console.error('Connection error:', err);
    });

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    const isPlayerTurn = gameState && gameState.currentPlayerIndex === gameState.players.findIndex(p => p.id === socket.id);
    if (isPlayerTurn && !gameState.gameEnded) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer === 1) {
              clearInterval(timerRef.current);
              timerRef.current = null;
              setTimerExpired(true);
              handleAutoPlay();
              return 20;
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
      setTimer(20); // Reset timer when it's not player's turn
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, socket]);

  const isAnimatingRef = useRef(false);
  const discardTimeoutRef = useRef(null);

  const handleAutoPlay = useCallback(() => {
    if (gameState && socket && !isAutoPlaying) {
      setIsAutoPlaying(true);

      // Auto draw from deck
      socket.emit('player-action', { type: 'draw', fromDeck: true });

      setTimeout(() => {
        const currentPlayerHand = gameState.players.find(p => p.id === socket.id)?.hand;

        if (currentPlayerHand && currentPlayerHand.length > 0) {
          const randomIndex = Math.floor(Math.random() * currentPlayerHand.length);

          if (!isAnimatingRef.current) {
            isAnimatingRef.current = true;
            setDiscardingIndex(randomIndex);

            discardTimeoutRef.current = setTimeout(() => {
              socket.emit('player-action', { type: 'discard', cardIndex: randomIndex });
              setDiscardingIndex(null);
              isAnimatingRef.current = false;
              setIsAutoPlaying(false);
            }, 400);
          }
        } else {
          setIsAutoPlaying(false);
        }
      }, 1000);
    }
  }, [gameState, socket, isAutoPlaying]);

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (playerName.trim() && socket) {
      socket.emit('join-game', playerName);
    }
  };

  const nextRound = () => {
    handleAction({ type: 'nextGame' });
  };

  const handleAction = useCallback((action) => {
    if (gameState && socket) {
      if (action.type === 'discard' && selectedIndices.length === 1) {
        setDiscardingIndex(selectedIndices[0]);
        setTimeout(() => {
          socket.emit('player-action', action);
          setSelectedIndices([]);
          setDiscardingIndex(null);
        }, 300);
      } else if (action.type === 'shuffle') {
        // Emit the shuffle action with the current player's index
        socket.emit('player-action', { 
          type: 'shuffle', 
          playerIndex: gameState.players.findIndex(p => p.id === socket.id) 
        });
      } else {
        socket.emit('player-action', action);
      }
    }
  }, [gameState, socket, selectedIndices]);

  const canDrawFromDiscard = useCallback(() => {
    if (!gameState || gameState.discardPile.length === 0) return false;
    const topDiscardCard = gameState.discardPile[gameState.discardPile.length - 1];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    for (let i = 0; i < currentPlayer.hand.length; i++) {
      for (let j = i + 1; j < currentPlayer.hand.length; j++) {
        if (
          isValidMeld([
            topDiscardCard,
            currentPlayer.hand[i],
            currentPlayer.hand[j],
          ])
        ) {
          return true;
        }
      }
    }

    for (const meld of currentPlayer.exposedMelds) {
      if (isValidMeld([...meld, topDiscardCard])) {
        return true;
      }
    }

    return false;
  }, [gameState]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleDiscardPile = () => setIsDiscardPileOpen(!isDiscardPileOpen);

  const animateClick = () => {
    setScale(0.99);
    setTimeout(() => setScale(1), 300);
  };

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
        <form onSubmit={handleJoinGame} className="bg-white p-8 rounded-lg shadow-lg">
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

  if (isWaiting) {
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

  if (!isDealingDone) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[url('/image/TableBot.svg')] bg-no-repeat bg-cover bg-center relative">
        <DealingAnimation onComplete={() => setIsDealingDone(true)} />
      </div>
    );
  }

  const DiscardPileModal = () => {
    setIsDiscardPileOpen(!isDiscardPileOpen);
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
  const player = gameState.players[playerIndex];
  console.log(gameState);
  const isPlayerTurn = gameState.currentPlayerIndex === gameState.players.findIndex(p => p.id === socket.id);
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
        <GameHeaderPot betAmout={paramValue} gameState={gameState} socket={socket} />
      </div>

      <div className="flex w-full max-w-7xl gap-4">
        <div className="w-full flex flex-col justify-between items-center gap-10">
          <div className='absolute z-10'>
            <MeldedCards
              contextText={`text-3xl`}
              gameState={gameState}
              socket={socket.id}
              players={gameState.players}
              onSapawSelect={setSelectedSapawTarget}
              currentPlayerIndex={gameState.currentPlayerIndex}
              selectedSapawTarget={selectedSapawTarget}
              socketId={socket.id}
              game={gameState}
            />
          </div>

          <div className="p-4 2xl:px-8 rounded-md flex justify-center space-x-2 mb-10 mt-10 relative">
            <Deck
              cardsLeft={gameState.deck.length}
              onDraw={() => isPlayerTurn && !gameState.gameEnded && handleAction({ type: 'draw', fromDeck: true })}
              disabled={gameState.hasDrawnThisTurn || !isPlayerTurn || gameState.gameEnded}
            />
            <DiscardPile
              currentPlayer={isPlayerTurn}
              topCard={gameState.discardPile[gameState.discardPile.length - 1]}
              onDraw={() => isPlayerTurn && !gameState.gameEnded && handleAction({ type: 'draw', fromDeck: false })}
              disabled={gameState.hasDrawnThisTurn || !isPlayerTurn || gameState.gameEnded || !canDrawFromDiscard()}
              canDraw={canDrawFromDiscard()}
              setPosition={setPosition}
            />
            <Discardpile
              discardCard={gameState.discardPile}
              isOpen={isDiscardPileOpen}
              onClose={() => setIsDiscardPileOpen(false)}
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

          <div className="pb-6 mt-10 pr-20 2xl:py-24 2xl:pr-0 ">
            <PlayerHand
              position={position}
              cardSize={" w-1.5 h-22 p-2 text-4xl"}
              hand={gameState.players.find(p => p.id === socket.id)?.hand}
              onCardClick={(index) => {
                if (isPlayerTurn && !gameState.gameEnded) {
                  const newSelectedIndices = selectedIndices.includes(index)
                    ? selectedIndices.filter(i => i !== index)
                    : [...selectedIndices, index];
                  setSelectedIndices(newSelectedIndices);
                  handleAction({ type: 'updateSelectedIndices', indices: newSelectedIndices });
                }
              }}
              selectedIndices={selectedIndices}
              isCurrentPlayer={isPlayerTurn && !gameState.gameEnded}
              discardingIndex={discardingIndex}
            />
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-64 w-24 h-24 "> 
        <PlayerPoints
          socket={socket}
          gameState={gameState}
          getCardValue={calculateCardPoints}
        />
      </div>
      <div className="absolute right-0 bottom-0 w-24 h-24 ">
        <button onClick={toggleChat}>
          <img
            onClick={animateClick}
            src="/image/chatButton.svg"
            alt="My image"
            className="w-24 h-24 absolute right-2 2xl:right-10 bottom-28"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
      </div>

      <div className="absolute left-5 bottom-64">
        <GameRound gameState={gameState} />
        <div className={`absolute top-16 left-1/2 transform -translate-x-1/2  w-14 h-14 flex justify-center items-center p-2`}>
        <CircularCountdown timer={timer} gameState={gameState} isPlayerTurn={isPlayerTurn} />
        </div>
      </div>

      <GameFooter
        onShuffle={() => handleAction({ type: 'shuffle'})}
        onMeld={() => {
          if (isPlayerTurn && selectedIndices.length >= 3 && !gameState.gameEnded) {
            handleAction({ type: 'meld', cardIndices: selectedIndices });
          }
          selectedIndices.length > 0 && setSelectedIndices([]);
        }}
        onDiscard={() => {
          if (isPlayerTurn && selectedIndices.length === 1 && !gameState.gameEnded) {
            setDiscardingIndex(selectedIndices[0]);
            setTimeout(() => {
              handleAction({ type: 'discard', cardIndex: selectedIndices[0] });
              setSelectedIndices([]);
              setDiscardingIndex(null);
            }, 200);
          }
        }}
        onSapaw={() => {
          if (isPlayerTurn && selectedSapawTarget && selectedIndices.length > 0 && !gameState.gameEnded) {
            handleAction({
              type: 'sapaw',
              target: selectedSapawTarget,
              cardIndices: selectedIndices
            });
            setSelectedSapawTarget(null);
          }
          selectedIndices.length > 0 && setSelectedIndices([]);
        }}
        onCallDraw={() => {
          if (isPlayerTurn && !gameState.gameEnded && currentPlayer.exposedMelds.length > 0) {
            handleAction({ type: 'callDraw' });
          }
        }}
        isPlayerTurn={isPlayerTurn}
        gameEnded={gameState.gameEnded}
        hasDrawnThisTurn={gameState.hasDrawnThisTurn}
        selectedIndices={selectedIndices}
        selectedSapawTarget={selectedSapawTarget}
      />

      {gameState.gameEnded && (
        <ScoreDashboard
          socketId={socket.id}
          gameState={gameState}
          onClose={() => setIsScoreboardVisible(false)}
          Reset={nextRound}
          resetGame={() => handleAction({ type: 'resetGame' })}
          setPlayersCount={setPlayersCount}
        />
      )}

      <ChatSideBar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        {currentAction && <ActionText action={currentAction} />}
    </div>
  );
};

export default Game;

