"use client"

import { useState, useEffect, useRef } from "react"
import  { Socket } from "socket.io-client"

const AudioControls = ({ roomId, socket }) => {
  const [isAudioOn, setIsAudioOn] = useState(false)
  const audioContextRef = useRef(null)
  const streamRef = useRef(null)
  const processorRef = useRef(null)
  const sourceRef = useRef(null)

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 44100,
    })

    socket.on("audio_stream", async (audioData) => {
      try {
        if (audioContextRef.current && Array.isArray(audioData)) {
          const audioBuffer = audioContextRef.current.createBuffer(
            1, // mono
            audioData.length,
            audioContextRef.current.sampleRate,
          )

          const channelData = audioBuffer.getChannelData(0)
          for (let i = 0; i < audioData.length; i++) {
            channelData[i] = audioData[i]
          }

          const source = audioContextRef.current.createBufferSource()
          source.buffer = audioBuffer
          source.connect(audioContextRef.current.destination)
          source.start()
        }
      } catch (err) {
        console.error("Error playing audio:", err)
      }
    })

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (processorRef.current) {
        processorRef.current.disconnect()
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [socket])

  const toggleAudio = async () => {
    if (!isAudioOn) {
      try {
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume()
        }

        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })

        const audioContext = audioContextRef.current
        if (!audioContext) return

        const source = audioContext.createMediaStreamSource(streamRef.current)
        sourceRef.current = source

        const processor = audioContext.createScriptProcessor(4096, 1, 1)
        processorRef.current = processor

        source.connect(processor)
        processor.connect(audioContext.destination)

        let lastSendTime = 0
        const sendInterval = 50 // Send every 50ms

        processor.onaudioprocess = (e) => {
          const now = Date.now()
          if (now - lastSendTime >= sendInterval) {
            const inputData = e.inputBuffer.getChannelData(0)
            const dataToSend = Array.from(inputData)

            socket.emit("audio_stream", {
              room: roomId,
              audio: dataToSend,
            })
            lastSendTime = now
          }
        }

        setIsAudioOn(true)
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (processorRef.current) {
        processorRef.current.disconnect()
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect()
      }
      setIsAudioOn(false)
    }
  }

  return (
    <div className="p-4 rounded-lg">
      <button
        onClick={toggleAudio}
        className={`w-full p-2 rounded-md transition-colors  ${
          isAudioOn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        {isAudioOn ? "Turn Off Mic" : "Turn On Mic"}
      </button>
    </div>
  )
}

export default AudioControls

