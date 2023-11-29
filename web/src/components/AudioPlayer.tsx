import { PauseCircle, Play } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src: string
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef(new Audio(src));
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    if (!audioRef.current) return;

    const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    if (progressRef.current) {
      progressRef.current.style.width = `${newProgress}%`;
    }

    requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audioRef.current.removeEventListener('timeupdate', updateProgress);
      audioRef.current.removeEventListener("ended", () => setIsPlaying(false))
    };
  }, []);

  return (
    <div className='flex gap-1 items-center w-full'>
      <button className="text-yellow-200" onClick={togglePlayPause}>
        {isPlaying ? <PauseCircle height={30} width={30} /> : <Play height={30} width={30} />}
      </button>

      <div className="mx-2 w-full h-0.5 bg-gray-400 rounded overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gray-200 transition duration-150"
        ></div>
      </div>
    </div>
  );
};
