import { useCallback, useRef, useEffect } from 'react';

export const useAudio = (soundUrl) => {
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);


  const loadSound = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const context = audioContextRef.current;

    try {
      
      const response = await fetch(soundUrl);
      const arrayBuffer = await response.arrayBuffer();
      
      audioBufferRef.current = await context.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }, [soundUrl]);

  // Function to play the sound
  const playSound = useCallback(() => {
    if (!audioBufferRef.current || !audioContextRef.current) {
      console.error('Audio not loaded or AudioContext not initialized');
      return;
    }

    const context = audioContextRef.current;
    const source = context.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(context.destination);
    source.start();
  }, []);

  // Load the sound when the hook is initialized
  useEffect(() => {
    loadSound();  // Ensure the sound is loaded once when the hook is used
  }, [loadSound]);

  return { playSound };
};
