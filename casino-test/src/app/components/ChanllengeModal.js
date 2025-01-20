import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChallengeModal = ({ isOpen, onClose, onAccept, onDecline, initiator, target }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Challenge!</h2>
            {target ? (
              <p className="mb-4">{initiator} has challenged {target}. Do you accept the challenge?</p>
            ) : (
              <p className="mb-4">{initiator} has initiated a challenge. Do you want to participate?</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={onDecline}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChallengeModal;
