import { AnimatePresence } from "framer-motion";
import GlitterFire from "./FireEffects";
import FireEffect from "./war-animation";
import LightningEffect from "./lightning-Effects";
import RainEffects from "./rain-effects";
import RainAnimation from "./rain-effects";

const FightModal = ({
  isOpen,
  onClose,
  onAccept,
  onDecline,
  initiator,
  currentPlayer,
}) => {
  // Don't show modal if current player is the initiator
  if (currentPlayer === initiator) return null;

  console.log("Fight Challenge Modal");

  return (
    <AnimatePresence>
      {isOpen && (
        // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        //   <div className="bg-blue-300/35 rounded-lg shadow-lg p-6 w-96">
        //     <h2 className="bg-clip-text text-transparent bg-text-gradient text-4xl font-extrabold font-jaro text-stroke-thin tracking-tighter">
        //       Fight Request
        //     </h2>
        //     <p className="mb-4 text-white font-jainiPurva text-2xl">
        //       {initiator} wants to fight you! Do you accept?
        //     </p>
        //     <div className="flex justify-end space-x-4">
        //       <button
        //         className="bg-red-500 w-20 font-jaro hover:bg-red-700 text-white  py-2 px-4 text-xl rounded-full border-b-2 border-blue-100"
        //         onClick={onDecline}
        //       >
        //         Fold
        //       </button>
        //       <button
        //         className="bg-blue-800 w-20 font-jaro hover:bg-green-700 text-white py-2 px-4 text-xl rounded-full border-b-2 border-blue-100"
        //         onClick={onAccept}
        //       >
        //         Fight
        //       </button>
        //     </div>
        //   </div>
        // </div>

        <motion.div
          className={`modal-container two ${isModalActive ? "" : "out"}`}
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-background z-50">
            <motion.div
              className="bg-orange-400 h-full w-1/2  absolute inset-y-0 left-0 left_player mt-40"
              initial={{ x: -1500, skew: "30deg", scaleX: 1.3 }}
              animate={{ x: 0, skew: "0deg", scaleX: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.3,
              }}
            >
              <LightningEffect />
            </motion.div>
            {/* {innitiatir } */}
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="absolute inset-x-0 bottom-0">
                <FireEffect />
                <div className="absolute inset-x-0 bottom-72 ">
                  <div>
                    <div className="flame">
                      <h1 className="fire-text_h1 text-[8rem]">
                        <span className="font-[1000] fire-text_span tracking-[.15em]">
                          FIGHT
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              className="bg-emerald-400 h-full w-1/2 absolute inset-y-0 right-0 right_player mt-40"
              initial={{ x: 1500, skew: "-30deg", scaleX: 1.3 }}
              animate={{ x: 0, skew: "0deg", scaleX: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.3,
              }}
            >
              <RainAnimation />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FightModal;
