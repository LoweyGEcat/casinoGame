import { AnimatePresence } from 'framer-motion';
import GlitterFire from './FireEffects';
const FightModal = ({ isOpen, onClose, onAccept, onDecline, initiator, currentPlayer }) => {
  // Don't show modal if current player is the initiator
  if (currentPlayer === initiator) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-300/35 rounded-lg shadow-lg p-6 w-96">
            <h2 className="bg-clip-text text-transparent bg-text-gradient text-4xl font-extrabold font-jaro text-stroke-thin tracking-tighter">Fight Request</h2>
            <p className="mb-4 text-white font-jainiPurva text-2xl">
              {initiator} wants to fight you! Do you accept?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 w-20 font-jaro hover:bg-red-700 text-white  py-2 px-4 text-xl rounded-full border-b-2 border-blue-100"
                onClick={onDecline}
              >
                Fold
              </button>
              <button
                className="bg-blue-800 w-20 font-jaro hover:bg-green-700 text-white py-2 px-4 text-xl rounded-full border-b-2 border-blue-100"
                onClick={onAccept}
              >
                Fight
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FightModal;