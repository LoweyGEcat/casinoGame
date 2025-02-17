"use client";

import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

const AudioControls = ({ roomId, socket }) => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)({
      sampleRate: 44100,
    });

    socket.on("audio_stream", async (audioData) => {
      try {
        if (audioContextRef.current && Array.isArray(audioData)) {
          const audioBuffer = audioContextRef.current.createBuffer(
            1, // mono
            audioData.length,
            audioContextRef.current.sampleRate
          );

          const channelData = audioBuffer.getChannelData(0);
          for (let i = 0; i < audioData.length; i++) {
            channelData[i] = audioData[i];
          }

          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.start();
        }
      } catch (err) {
        console.error("Error playing audio:", err);
      }
    });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [socket]);

  const toggleAudio = async () => {
    if (!isAudioOn) {
      try {
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }

        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        const audioContext = audioContextRef.current;
        if (!audioContext) return;

        const source = audioContext.createMediaStreamSource(streamRef.current);
        sourceRef.current = source;

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioContext.destination);

        let lastSendTime = 0;
        const sendInterval = 50; // Send every 50ms

        processor.onaudioprocess = (e) => {
          const now = Date.now();
          if (now - lastSendTime >= sendInterval) {
            const inputData = e.inputBuffer.getChannelData(0);
            const dataToSend = Array.from(inputData);

            socket.emit("audio_stream", {
              room: roomId,
              audio: dataToSend,
            });
            lastSendTime = now;
          }
        };

        setIsAudioOn(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      setIsAudioOn(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <input
        type="checkbox"
        id="checkbox"
        checked={isAudioOn}
        onChange={toggleAudio}
        className="hidden"
      />
      <label
        className="switch cursor-pointer flex items-center gap-2"
        htmlFor="checkbox"
      >
        <div className={`mic-on ${isAudioOn ? "text-red-500" : "text-white"}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-mic-fill"
            viewBox="0 0 16 16"
          >
            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"></path>
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"></path>
          </svg>
        </div>
        <div
          className={`mic-off ${!isAudioOn ? "text-red-500" : "text-white"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-mic-mute-fill"
            viewBox="0 0 16 16"
          >
            <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z"></path>
            <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"></path>
          </svg>
        </div>
      </label>
    </div>
  );
};

export default AudioControls;
