import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ActionText = ({ action }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [action]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute flex  font-extrabold font-jaro justify-center items-center bg-black/40 text-white px-4 py-2 rounded-lg text-xl z-50 "
        >
          {action}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionText;