import { useRef, useEffect, useState } from "react";

export const useHoverSound = (soundPath: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(soundPath);

    // Add event listeners
    const handleCanPlayThrough = () => {
      console.log("Audio loaded successfully:", soundPath);
      setIsLoaded(true);
    };

    const handleError = (error: any) => {
      console.error("Error loading audio:", error, soundPath);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough);
      audioRef.current.addEventListener("error", handleError);

      // Force load the audio
      audioRef.current.load();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
        audioRef.current.removeEventListener("error", handleError);
      }
    };
  }, [soundPath]);

  const playSound = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn("Audio play failed:", error);
      });
    } else if (!isLoaded) {
      console.log("Audio not loaded yet");
    }
  };

  return { playSound, isLoaded };
};
