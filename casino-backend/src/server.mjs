import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createDeck, dealCards, isValidMeld, calculateHandPoints, canFormMeldWithCard, sortCards, shuffleDeck } from './utils/card-utils.mjs';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const games = new Map();
const PLAYERS_REQUIRED = 3;


// GAME SET UP 
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('join-game', (playerName) => {
    let game = Array.from(games.values()).find(g => g.players.length < PLAYERS_REQUIRED);
    
    if (!game) {
      game = {
        id: Date.now().toString(),
        players: [],
        deck: [],
        deckEmpty:false,
        discardPile: [],
        currentPlayerIndex: 0,
        hasDrawnThisTurn: false,
        round: 1,
        entryFee: 500,
        gameEnded: false,
        selectedCardIndices: [],
        gameStarted: false,
        firstPlayerHasPlayed: false
      };
      games.set(game.id, game);
    }

    const playerNumber = game.players.length + 1;
    
    game.players.push({
      id: socket.id,
      name: playerName,
      playerNumber,
      hand: [],
      exposedMelds: [],
      secretMelds: [],
      score: 0,
      consecutiveWins: 0,
      isSapawed: false,
      points: 0,
      turnsPlayed: 0,
      isBot: false
    });

    socket.join(game.id);

    io.to(game.id).emit('player-joined', {
      playerName,
      playerNumber,
      playersCount: game.players.length
    });

    if (game.players.length === PLAYERS_REQUIRED && !game.gameStarted) {
      game.gameStarted = true;
      setTimeout(() => startGame(game), 1000);
    }

    io.to(game.id).emit('game-state', game);
  });

  socket.on('player-action', (action) => {
    const game = Array.from(games.values()).find(g => 
      g.players.some(p => p.id === socket.id)
    );
    
    if (!game) return;

    const playerIndex = game.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== game.currentPlayerIndex) return;

    handlePlayerAction(game, action, playerIndex);
    io.to(game.id).emit('game-state', game);

    // Check if it's a bot's turn after the human player's action
    if (!game.gameEnded && game.players[game.currentPlayerIndex].isBot) {
      setTimeout(() => botTurn(game), 1000);
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    for (const [gameId, game] of games) {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const player = game.players[playerIndex];
        game.players.splice(playerIndex, 1);
        if (game.players.length === 0) {
          games.delete(gameId);
        } else {
          io.to(gameId).emit('player-disconnected', {
            playerName: player.name,
            playerNumber: player.playerNumber,
            playersCount: game.players.length
          });
          io.to(gameId).emit('game-state', game);
        }
        break;
      }
    }
  });
});

// GAME START
function startGame(game) {
  if (game.players.length !== PLAYERS_REQUIRED) return;

  game.deck = createDeck();
  const { hands, remainingDeck } = dealCards(game.deck, PLAYERS_REQUIRED, 12);
  game.deck = remainingDeck;
  game.discardPile = [];
  game.hasDrawnThisTurn = true; // Set to true for the first player
  game.selectedCardIndices = [];
  game.firstPlayerHasPlayed = false;

  game.players.forEach((player, index) => {
    player.hand = hands[index];
    if (index === 0) {
      // Give the first player an extra card
      player.hand.push(game.deck.pop());
    }
    player.exposedMelds = [];
  });

  io.to(game.id).emit('game-started', game);
  io.to(game.id).emit('game-state', game);

  // If the first player is a bot, start its turn
  if (game.players[0].isBot) {
    setTimeout(() => botTurn(game), 1000);
  }
}

// HANDLE PLAYER ACTION
function handlePlayerAction(game, action, playerIndex) {
  // Prevent the first player from drawing on their first turn
  if (playerIndex === 0 && !game.firstPlayerHasPlayed && action.type === 'draw') {
    return;
  }

  switch (action.type) {
    case 'draw':
      handleDraw(game, action.fromDeck, action.meldIndices);
      break;
    case 'discard':
      handleDiscard(game, action.cardIndex);
      if (playerIndex === 0 && !game.firstPlayerHasPlayed) {
        game.firstPlayerHasPlayed = true;
      }
      break;
    case 'meld':
      handleMeld(game, action.cardIndices);
      break;
    case 'sapaw':
      handleSapaw(game, action.target.playerIndex, action.target.meldIndex, action.cardIndices);
      break;
    case 'callDraw':
      handleCallDraw(game);
      break;
    case 'updateSelectedIndices':
      game.selectedCardIndices = action.indices;
      break;
    case 'autoSort':
      handleAutoSort(game, playerIndex);
      break;
    case 'shuffle':
      handleShuffle(game, playerIndex);
      break;
    case 'nextGame':
      handleNextGame(game);
      break;
    case 'resetGame':
      handleResetGame(game);
      break;
  }
}


// PLAYER DRAW
function handleDraw(game, fromDeck, meldIndices = []) {
  if (game.hasDrawnThisTurn) return;

  const currentPlayer = game.players[game.currentPlayerIndex];
  let drawnCard;

  if (!fromDeck && game.discardPile.length > 0) {
    const topCard = game.discardPile[game.discardPile.length - 1];
    const { canMeld } = canFormMeldWithCard(topCard, currentPlayer.hand);

    if (!canMeld) {
      return; // Can't draw from discard if no potential meld
    }

    drawnCard = game.discardPile.pop();
    
    if (meldIndices.length > 0) {
      const meldCards = [...meldIndices.map(i => currentPlayer.hand[i]), drawnCard];
      if (isValidMeld(meldCards)) {
        meldIndices.sort((a, b) => b - a).forEach(index => {
          currentPlayer.hand.splice(index, 1);
        });
        currentPlayer.exposedMelds.push(meldCards);
        game.selectedCardIndices = [];
        game.hasDrawnThisTurn = true;
        return;
      }
    }
  } else if (game.deck.length > 0) {
    drawnCard = game.deck.pop();
  }

  if (drawnCard) {
    currentPlayer.hand.push(drawnCard);
    game.hasDrawnThisTurn = true;
    
    // Set deckEmpty flag if this was the last card
    if (game.deck.length === 0) {
      game.deckEmpty = true;
    }
  }
}

// PLAYER DISCARD
function handleDiscard(game, cardIndex) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  
  if (!game.hasDrawnThisTurn || cardIndex >= currentPlayer.hand.length) {
    return;
  }

  // Remove the card from hand and add to discard pile
  const discardedCard = currentPlayer.hand.splice(cardIndex, 1)[0];
  game.discardPile.push(discardedCard);
  
  // Reset draw state
  game.hasDrawnThisTurn = false;
  
  // Check if game should end (deck is empty and player has discarded)
  if (game.deckEmpty) {
    handleCallDraw(game);
    return;
  }
  
  // Move to next player
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
}

// CALL A DRAW
function handleCallDraw(game) {
  const scores = game.players.map(player => ({
    id: player.id,
    score: calculateHandPoints(player.hand)
  }));

  const winner = scores.reduce((min, player) => 
    player.score < min.score ? player : min
  );

  game.players.forEach(player => {
    player.score = scores.find(s => s.id === player.id).score;
    if (player.id === winner.id) {
      player.consecutiveWins++;
    } else {
      player.consecutiveWins = 0;
    }
  });

  game.winner = game.players.find(p => p.id === winner.id);
  game.gameEnded = true;
}

// PLAYER MELD A CARD
function handleMeld(game, cardIndices) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const meldedCards = cardIndices.map(index => currentPlayer.hand[index]);

  if (!isValidMeld(meldedCards)) return;

  currentPlayer.exposedMelds.push(meldedCards);
  cardIndices.sort((a, b) => b - a).forEach(index => {
    currentPlayer.hand.splice(index, 1);
  });
  game.selectedCardIndices = [];

  // Check for Tongits (empty hand)
  if (currentPlayer.hand.length === 0) {
    handleTongits(game);
  }
}

// PLAYER DO A SAPAW
function handleSapaw(game, targetPlayerIndex, targetMeldIndex, cardIndices) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const targetPlayer = game.players[targetPlayerIndex];
  const sapawCards = cardIndices.map(index => currentPlayer.hand[index]);
  const targetMeld = [...targetPlayer.exposedMelds[targetMeldIndex], ...sapawCards];

  if (!isValidMeld(targetMeld)) return;

  targetPlayer.exposedMelds[targetMeldIndex] = targetMeld;
  cardIndices.sort((a, b) => b - a).forEach(index => {
    currentPlayer.hand.splice(index, 1);
  });
  targetPlayer.isSapawed = true;
  game.selectedCardIndices = [];
}


// HANDLE TONGIST
function handleTongits(game) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  currentPlayer.score = 0;
  currentPlayer.consecutiveWins++;

  game.players.forEach(player => {
    if (player.id !== currentPlayer.id) {
      player.score = calculateHandPoints(player.hand);
      // player.consecutiveWins = 0;
    }
  });

  game.winner = currentPlayer;
  game.gameEnded = true;
}

// SORT A CARD
function handleAutoSort(game, playerIndex) {
  const player = game.players[playerIndex];
  player.hand.sort((a, b) => {
    if (a.suit !== b.suit) {
      return a.suit.localeCompare(b.suit);
    }
    return a.rank.localeCompare(b.rank);
  });
}

// SHUFFLE CARD
function handleShuffle(game, playerIndex) {
  const player = game.players[playerIndex];
  for (let i = player.hand.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [player.hand[i], player.hand[j]] = [player.hand[j], player.hand[i]];
  }
}

// NEXT GAME
function handleNextGame(game) {
  // Preserve consecutive wins from previous round
  const preservedConsecutiveWins = game.players.map(player => player.consecutiveWins || 0);

  // Start the next round
  game.round++;
  game.deck = createDeck(); // Generate a new deck
  const { hands, remainingDeck } = dealCards(game.deck, PLAYERS_REQUIRED, 12);
  game.deck = remainingDeck;
  game.deckEmpty = false;
  game.discardPile = [];
  game.currentPlayerIndex = 0;
  game.hasDrawnThisTurn = true; // Set to true for the first player
  game.gameEnded = false;
  game.selectedCardIndices = [];
  game.firstPlayerHasPlayed = false;

  // Update the players' data, including preserving consecutive wins
  game.players = hands.map((hand, index) => ({
    ...game.players[index], // Keep the existing data from the previous game (including consecutiveWins)
    hand,
    exposedMelds: [],
    secretMelds: [],
    score: 0, // Reset score at the start of a new round
    consecutiveWins: preservedConsecutiveWins[index], // Preserve consecutive wins from previous round
    isSapawed: false,
    points: 0,
    turnsPlayed: 0,
  }));

  // Give the first player an extra card
  game.players[0].hand.push(game.deck.pop());

  io.to(game.id).emit('game-state', game);

  // If the first player is a bot, start its turn
  if (game.players[0].isBot) {
    setTimeout(() => botTurn(game), 1000);
  }
}

// RESET GAME
function handleResetGame(game) {
  game.round = 1;
  game.players.forEach(player => {
    player.consecutiveWins = 0;
  });
  handleNextGame(game);
}

// function botTurn(game) {
//   const bot = game.players[game.currentPlayerIndex];
//   if (!bot.isBot) return;

//   // Bot logic here
//   // For now, let's implement a simple strategy: draw a card and discard a random card

//   // Draw a card
//   handleDraw(game, true);

//   // Discard a random card
//   const randomCardIndex = Math.floor(Math.random() * bot.hand.length);
//   handleDiscard(game, randomCardIndex);

//   io.to(game.id).emit('game-state', game);

//   // Check if it's another bot's turn
//   if (!game.gameEnded && game.players[game.currentPlayerIndex].isBot) {
//     setTimeout(() => botTurn(game), 1000);
//   }
// }
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

