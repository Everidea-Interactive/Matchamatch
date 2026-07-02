"use client";

import { useRef } from "react";

export function useGameAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    return audioContextRef.current;
  }

  return {
    playSelect: () => {
      const context = getAudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.frequency.value = 220;
      gain.gain.value = 0.05;
      oscillator.start();
      oscillator.stop(context.currentTime + 0.06);
    },
  };
}
