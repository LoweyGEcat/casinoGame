import React from 'react';
import { motion } from 'framer-motion';



function PlayerIcon({ playerIndex, players, positioning, currentPlayerPOV }) {
  // Calculate the relative index based on the current player's POV
  const relativeIndex = React.useMemo(() => {
    const currentPlayerIndex = players.findIndex(player => player.id === currentPlayerPOV);
    return (playerIndex - currentPlayerIndex + players.length) % players.length;
  }, [playerIndex, players, currentPlayerPOV]);

  // Determine image URL based on relative index
  const imageUrl = relativeIndex === 0
    ? 'https://miro.medium.com/v2/resize:fit:1400/1*rKl56ixsC55cMAsO2aQhGQ@2x.jpeg'
    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVCTEOejHb2Cc4W8KxhLqz8_o5K2rO3XrfpA&s';

  return (
    <motion.div 
      className={`text-2xl absolute ${positioning}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="backdrop-blur-md bg-black/30 border border-white/10 text-white p-4 rounded-xl shadow-2xl max-w-xs w-full hover:bg-black/40 transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-sm"></div>
            <img
              src={imageUrl || "/placeholder.svg?height=64&width=64"}
              alt={`Player ${playerIndex + 1}`}
              className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20"
              style={{
                transition: "transform 0.3s ease-in-out",
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-xs font-bold px-2 py-1 rounded-full border border-emerald-400/50 shadow-lg">
              {players[playerIndex]?.hand?.length || 0} cards
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {players[playerIndex].name}
            </h2>
            <p className="text-sm text-gray-300">
              {`Player ${playerIndex + 1}`}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center border-t border-white/10 pt-3">
          <div>
            <p className="text-sm text-gray-400">Pot Money</p>
            <p className="text-lg font-bold text-emerald-400">
              ₱ {players[playerIndex].points || 0}
            </p>
          </div>
          {players[playerIndex].consecutiveWins > 0 && (
            <div className="bg-yellow-500/20 px-3 py-1 rounded-full">
              <p className="text-sm text-yellow-300">
                {players[playerIndex].consecutiveWins} streak
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default PlayerIcon;

