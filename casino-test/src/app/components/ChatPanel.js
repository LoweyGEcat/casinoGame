import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

function ChatPanel({ socket, playerIndex, gameId }) {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Listen for incoming messages
    const handleReceiveMessage = (data) => {
      console.log("Received message:", data); // Debug log
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup listener on unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]); // Added scrollToBottom to dependencies

  const sendMessage = (e) => {
    e.preventDefault();

    if (currentMessage.trim()) {
      const messageData = {
        room: gameId,
        message: currentMessage,
        author: `Player ${playerIndex}`,
        time: new Date().toLocaleTimeString(),
      };

      console.log("Sending message:", messageData); // Debug log

      socket.emit("send_message", messageData);

      // Add message to local state
      setMessages((prev) => [...prev, messageData]);

      setCurrentMessage("");
    }
  };

  console.log(messages);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`w-full rounded-lg p-2 `}>
            <div className="flex flex-row gap-2 min-w-0">
              <div className="text-sm flex flex-col min-w-0 w-full gap-2 ">
                {/* Only show author name if it's NOT the current player */}
                {msg.author !== `Player ${playerIndex}` && (
                  <div className="flex flex-row items-center gap-2">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1400/1*rKl56ixsC55cMAsO2aQhGQ@2x.jpeg"
                      className="rounded-full border border-yellow-300 bg-black w-8 h-8 flex-shrink-0"
                    />
                    <h1 className="font-bold text-xl text-white">
                      {msg.author}
                    </h1>
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-2 rounded-lg flex flex-col gap-2 ${
                    msg.author === `Player ${playerIndex}`
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <p className="break-all whitespace-pre-wrap w-full overflow-hidden font-medium">
                    {msg.message}
                  </p>
                  <div className="text-xs opacity-75 justify-end flex text-white">
                    {msg.time}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={sendMessage}
        className="sticky bottom-0 p-4 border-t  flex gap-2 jeorge"
      >
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
