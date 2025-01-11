import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  createDeck,
  dealCards,
  isValidMeld,
  calculateHandPoints,
} from "../utils/card-utils";
import { botPlayTurn } from "../utils/bot-utils";

// Assuming Card is already defined elsewhere in your code
// You would also need to define Player, GameState, and GameAction objects
// without using TypeScript type definitions.

export const Player = {
  id: 0,
  name: "",
  hand: [], // Array of Card objects
  exposedMelds: [], // Array of Card arrays
  secretMelds: [], // Array of Card arrays
  score: 0,
  consecutiveWins: 0,
  isSapawed: false,
  points: 0,
  turnsPlayed: 0,
};

export const GameState = {
  players: [], // Array of Player objects
  currentPlayerIndex: 0,
  deck: [], // Array of Card objects
  discardPile: [], // Array of Card objects
  winner: null, // Player or null
  potMoney: 3000,
  round: 1,
  tableCharge: 0,
  entryFee: 0,
  hasDrawnThisTurn: false,
  selectedCardIndices: [], // Array of card indices
  gameEnded: false,
};

export const GameAction = {
  type: "", // One of: 'draw', 'meld', 'sapaw', 'discard', 'callDraw'
  player: "", // String representing the player
  details: "", // Details about the action
  card: null, // Card or null
  cards: [], // Array of Card objects
  fromDiscard: false, // Boolean
  playerIndex: 0, // Index of the player
  meldIndex: 0, // Index of the meld
  cardIndex: 0, // Index of the card in hand
};

export function useTongitGame(initialGameMode) {
  const [gameState, setGameState] = useState(null);
  const [gameActions, setGameActions] = useState([]);
  const [isProcessingBotTurn, setIsProcessingBotTurn] = useState(false);
  const gameInitializedRef = useRef(false);

  const addGameAction = useCallback((action) => {
    setGameActions((prevActions) => [...prevActions, action]);
  }, []);

  const callDraw = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState) return null;

      const currentPlayer = prevState.players[prevState.currentPlayerIndex];

      if (
        prevState.hasDrawnThisTurn ||
        currentPlayer.turnsPlayed < 2 ||
        currentPlayer.isSapawed
      ) {
        return prevState;
      }

      const playerScores = prevState.players.map((player) => ({
        ...player,
        score: calculateHandPoints(player.hand, player.secretMelds),
      }));

      const winner = playerScores.reduce((min, player) =>
        player.score < min.score ? player : min
      );

      const updatedPlayers = playerScores.map((player) => ({
        ...player,
        consecutiveWins:
          player.id === winner.id ? player.consecutiveWins + 1 : 0,
      }));

      addGameAction({
        type: "callDraw",
        player: currentPlayer.name,
        details: `Called draw. ${winner.name} wins with ${winner.score} points.`,
      });

      return {
        ...prevState,
        players: updatedPlayers,
        winner: winner,
        gameEnded: true,
      };
    });
  }, [addGameAction]);

  const drawCard = useCallback(
    (fromDiscard) => {
      setGameState((prevState) => {
        if (!prevState || prevState.hasDrawnThisTurn) return prevState;

        const currentPlayer = prevState.players[prevState.currentPlayerIndex];
        let newCard;
        let newDeck;
        let newDiscardPile;

        if (fromDiscard && prevState.discardPile.length > 0) {
          const topDiscardCard =
            prevState.discardPile[prevState.discardPile.length - 1];

          const canDrawFromDiscard =
            currentPlayer.hand.some((card, index, hand) => {
              for (let i = index + 1; i < hand.length; i++) {
                if (isValidMeld([topDiscardCard, card, hand[i]])) {
                  return true;
                }
              }
              return false;
            }) ||
            currentPlayer.exposedMelds.some((meld) =>
              isValidMeld([...meld, topDiscardCard])
            );

          if (!canDrawFromDiscard) {
            if (prevState.deck.length === 0) {
              return prevState;
            }
            newCard = prevState.deck[prevState.deck.length - 1];
            newDeck = prevState.deck.slice(0, -1);
            newDiscardPile = prevState.discardPile;
          } else {
            newCard = topDiscardCard;
            newDiscardPile = prevState.discardPile.slice(0, -1);
            newDeck = prevState.deck;
          }
        } else {
          if (prevState.deck.length === 0) {
            return prevState;
          }
          newCard = prevState.deck[prevState.deck.length - 1];
          newDeck = prevState.deck.slice(0, -1);
          newDiscardPile = prevState.discardPile;
        }

        const newHand = [...currentPlayer.hand, newCard];
        const newPlayers = prevState.players.map((player, index) =>
          index === prevState.currentPlayerIndex
            ? { ...player, hand: newHand }
            : player
        );

        addGameAction({
          type: "draw",
          player: currentPlayer.name,
          details: `Drew ${newCard.rank} of ${newCard.suit} from ${
            fromDiscard ? "discard pile" : "deck"
          }`,
          card: newCard,
        });

        return {
          ...prevState,
          players: newPlayers,
          deck: newDeck,
          discardPile: newDiscardPile,
          hasDrawnThisTurn: true,
        };
      });
    },
    [addGameAction]
  );

  const discardCard = useCallback(
    (cardIndex) => {
      setGameState((prevState) => {
        if (!prevState) return null;
        const currentPlayer = prevState.players[prevState.currentPlayerIndex];
        const discardedCard = currentPlayer.hand[cardIndex];
        const newHand = currentPlayer.hand.filter(
          (_, index) => index !== cardIndex
        );
        const newPlayers = prevState.players.map((player, index) =>
          index === prevState.currentPlayerIndex
            ? {
                ...player,
                hand: newHand,
                isSapawed: false,
                turnsPlayed: player.turnsPlayed + 1,
              }
            : player
        );

        let nextPlayerIndex =
          (prevState.currentPlayerIndex + 1) % prevState.players?.length;
        if (nextPlayerIndex > 2) nextPlayerIndex = 0;

        addGameAction({
          type: "discard",
          player: currentPlayer.name,
          details: `Discarded ${discardedCard?.rank} of ${discardedCard?.suit}`,
          card: discardedCard,
        });

        return {
          ...prevState,
          players: newPlayers,
          currentPlayerIndex: nextPlayerIndex,
          discardPile: [...prevState.discardPile, discardedCard],
          hasDrawnThisTurn: false,
          selectedCardIndices: [],
        };
      });
    },
    [addGameAction]
  );

  const meldCards = useCallback(
    (cardIndices) => {
      setGameState((prevState) => {
        if (!prevState) return null;
        const currentPlayer = prevState.players[prevState.currentPlayerIndex];
        const meldedCards = cardIndices.map(
          (index) => currentPlayer.hand[index]
        );

        if (!isValidMeld(meldedCards)) {
          return prevState;
        }

        const newHand = currentPlayer.hand.filter(
          (_, index) => !cardIndices.includes(index)
        );
        const newPlayers = prevState.players.map((player, index) =>
          index === prevState.currentPlayerIndex
            ? {
                ...player,
                hand: newHand,
                exposedMelds: [...player.exposedMelds, meldedCards],
                secretMelds: [...player.secretMelds],
              }
            : player
        );

        addGameAction({
          type: "meld",
          player: currentPlayer.name,
          details: `Melded ${meldedCards.length} cards`,
          cards: meldedCards,
        });

        return {
          ...prevState,
          players: newPlayers,
          selectedCardIndices: [],
        };
      });
    },
    [addGameAction]
  );

  const sapaw = useCallback(
    (playerIndex, meldIndex, cardIndices) => {
      setGameState((prevState) => {
        if (!prevState) return null;
        const currentPlayer = prevState.players[prevState.currentPlayerIndex];
        const targetPlayer = prevState.players[playerIndex];
        const sapawCards = cardIndices.map(
          (index) => currentPlayer.hand[index]
        );
        const targetMeld = [
          ...targetPlayer.exposedMelds[meldIndex],
          ...sapawCards,
        ];

        if (!isValidMeld(targetMeld)) {
          return prevState;
        }

        const newCurrentPlayerHand = currentPlayer.hand.filter(
          (_, index) => !cardIndices.includes(index)
        );
        const newTargetPlayerMelds = targetPlayer.exposedMelds.map(
          (meld, index) => (index === meldIndex ? targetMeld : meld)
        );

        const newPlayers = prevState.players.map((player, index) => {
          if (index === prevState.currentPlayerIndex) {
            return {
              ...player,
              hand: newCurrentPlayerHand,
              exposedMelds:
                index === playerIndex
                  ? newTargetPlayerMelds
                  : player.exposedMelds,
            };
          } else if (index === playerIndex) {
            return {
              ...player,
              exposedMelds: newTargetPlayerMelds,
              isSapawed: true,
            };
          }
          return player;
        });

        addGameAction({
          type: "sapaw",
          player: currentPlayer.name,
          details: `Sapawed ${sapawCards.length} cards to ${targetPlayer.name}'s meld`,
          cards: sapawCards,
          playerIndex: playerIndex,
          meldIndex: meldIndex,
        });

        return {
          ...prevState,
          players: newPlayers,
          selectedCardIndices: [],
        };
      });
    },
    [addGameAction]
  );

  const checkTongits = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState) return null;
      const currentPlayer = prevState.players[prevState.currentPlayerIndex];

      if (currentPlayer.hand.length === 0) {
        const newPlayers = prevState.players.map((player) =>
          player.id === currentPlayer.id
            ? {
                ...player,
                consecutiveWins: player.consecutiveWins + 1,
                score: 0,
              }
            : {
                ...player,
                consecutiveWins: 0,
                score: calculateHandPoints(player.hand, player.secretMelds),
              }
        );

        addGameAction({
          type: "callDraw",
          player: currentPlayer.name,
          details: `Called Tongits! ${currentPlayer.name} wins with a score of 0.`,
        });

        return {
          ...prevState,
          players: newPlayers,
          winner: currentPlayer,
          gameEnded: true,
        };
      }

      return prevState;
    });
  }, [addGameAction]);

  const updateSelectedCardIndices = useCallback((indices) => {
    setGameState((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        selectedCardIndices: indices,
      };
    });
  }, []);

  const botTurn = useCallback(() => {
    setIsProcessingBotTurn(true);
    setGameState((prevState) => {
      if (!prevState || prevState.currentPlayerIndex === 0) return prevState;

      const botActions = botPlayTurn(prevState);
      let newState = prevState;

      for (const action of botActions) {
        switch (action.type) {
          case "draw":
            if (!newState.hasDrawnThisTurn) {
              newState = { ...newState, hasDrawnThisTurn: true };
              if (action.fromDiscard && newState.discardPile.length > 0) {
                const drawnCard = newState.discardPile.pop();
                newState.players[newState.currentPlayerIndex].hand.push(
                  drawnCard
                );
                addGameAction({
                  type: "draw",
                  player: newState.players[newState.currentPlayerIndex].name,
                  details: "Drew a card from discard pile",
                  fromDiscard: true,
                });
              } else if (newState.deck.length > 0) {
                const drawnCard = newState.deck.pop();
                newState.players[newState.currentPlayerIndex].hand.push(
                  drawnCard
                );
                addGameAction({
                  type: "draw",
                  player: newState.players[newState.currentPlayerIndex].name,
                  details: "Drew a card from deck",
                });
              }
            }
            break;
          case "meld":
            newState = { ...newState, ...meldCards(action.cardIndices) };
            break;
          case "sapaw":
            newState = {
              ...newState,
              ...sapaw(
                action.playerIndex,
                action.meldIndex,
                action.cardIndices
              ),
            };
            break;
          case "discard":
            newState = { ...newState, ...discardCard(action.cardIndex) };
            break;
        }
      }

      setIsProcessingBotTurn(false);
      return newState;
    });
  }, [meldCards, sapaw, discardCard, addGameAction]);

  const isDeckEmpty = useCallback(() => {
    return gameState?.deck.length === 0;
  }, [gameState]);

  useEffect(() => {
    if (initialGameMode && !gameInitializedRef.current) {
      const deck = createDeck();
      const { hands, remainingDeck } = dealCards(deck, 3, 12);
      const players = hands.map((hand, index) => ({
        id: index,
        name: index === 0 ? "You" : `Bot ${index}`,
        hand,
        exposedMelds: [],
        secretMelds: [],
        score: 0,
        consecutiveWins: 0,
        isSapawed: false,
        points: 0,
        turnsPlayed: 0,
      }));
      setGameState({
        players,
        currentPlayerIndex: 0,
        deck: remainingDeck,
        discardPile: [],
        winner: null,
        potMoney: 3000,
        round: 1,
        tableCharge: 50,
        entryFee: 100,
        hasDrawnThisTurn: false,
        selectedCardIndices: [],
        gameEnded: false,
      });
      gameInitializedRef.current = true;
    }
  }, [initialGameMode]);


  const nextGame = useCallback(() => {
    
    // Check the Consecutive win of the player 
    const preservedPlayers = gameState.players.map((player) => ({
      consecutiveWins: player.consecutiveWins, // retrieve the old value of consecutive of the player
    }));
  
    // Create the deck and deal the cards as before
    const deck = createDeck();
    const { hands, remainingDeck } = dealCards(deck, 3, 12);
  
    // Create new players, but use the preserved `consecutiveWins` values
    const players = hands.map((hand, index) => ({
      id: index,
      name: index === 0 ? "You" : `Bot ${index}`,
      hand,
      exposedMelds: [],
      secretMelds: [],
      score: 0,
      consecutiveWins: preservedPlayers[index]?.consecutiveWins || 0, // Use the preserved value if available
      isSapawed: false,
      points: 0,
      turnsPlayed: 0,
    }));
    // Increment the round by 1 (or set a default if it doesn't exist)
    const nextRound = gameState.round + 1;
  
    setGameState({
      players,
      currentPlayerIndex: 0,
      deck: remainingDeck,
      discardPile: [],
      winner: null,
      potMoney: 3000,
      tableCharge: 50,
      entryFee: 100,
      hasDrawnThisTurn: false,
      selectedCardIndices: [],
      gameEnded: false,
      round: nextRound, // Update the round number
    });
  
    // Mark game as initialized
    gameInitializedRef.current = true;
  }, [gameState]);
  

  const resetGame = useCallback(() => {
    if (initialGameMode && !gameInitializedRef.current) {
      const deck = createDeck();
      const { hands, remainingDeck } = dealCards(deck, 3, 12);
      const players = hands.map((hand, index) => ({
        id: index,
        name: index === 0 ? "You" : `Bot ${index}`,
        hand,
        exposedMelds: [],
        secretMelds: [],
        score: 0,
        consecutiveWins: 0,
        isSapawed: false,
        points: 0,
        turnsPlayed: 0,
      }));
      setGameState({
        players,
        currentPlayerIndex: 0,
        deck: remainingDeck,
        discardPile: [],
        winner: null,
        potMoney: 0,
        round: 1,
        tableCharge: 50,
        entryFee: 100,
        hasDrawnThisTurn: false,
        selectedCardIndices: [],
        gameEnded: false,
      });
      gameInitializedRef.current = true;
    }
  }, [initialGameMode]);

  useEffect(() => {
    if (gameState && isDeckEmpty() && !gameState.gameEnded) {
      const newState = callDraw();
      if (newState) {
        setGameState(newState);
      }
    }
  }, [gameState, isDeckEmpty, callDraw]);

  return {
    nextGame,
    resetGame,
    gameState,
    gameActions,
    drawCard,
    discardCard,
    meldCards,
    sapaw,
    checkTongits,
    updateSelectedCardIndices,
    botTurn,
    isProcessingBotTurn,
    isDeckEmpty,
    callDraw,
  };
}
