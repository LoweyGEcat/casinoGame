import { AnimatePresence } from 'framer-motion';

const FightModal = ({ isOpen, onClose, onAccept, onDecline, initiator, currentPlayer }) => {
  // Don't show modal if current player is the initiator
  if (currentPlayer === initiator) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Fight Request</h2>
            <p className="mb-4">
              {initiator} wants to fight you! Do you accept?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={onDecline}
              >
                Decline
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={onAccept}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FightModal;