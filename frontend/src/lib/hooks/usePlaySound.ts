import GameBeat from "@pages/Game/assets/game-beat-1.mp3";
import { useRef, useState } from "react";

export default function usePlaySound(): {
  start: () => void;
  mute: () => void;
  unmute: () => void;
  muted: boolean;
  pause: () => void;
} {
  const audio = new Audio(GameBeat);
  const audioRef = useRef<HTMLAudioElement>(audio);
  const [muted, setMuted] = useState(true);

  const start = (): void => {
    audioRef.current.volume = 0.1;
    audioRef.current.loop = true;
    void audioRef.current.play();
  };
  const pause = (): void => {
    audioRef.current.pause();
  };
  const mute = (): void => {
    audioRef.current.muted = true;
    setMuted(false);
  };

  const unmute = (): void => {
    audioRef.current.muted = false;
    setMuted(true);
  };

  return { start, mute, unmute, muted, pause };
}
