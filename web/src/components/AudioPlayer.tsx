import { PauseCircle, Play } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src: string
  isSender?: boolean
}

export function AudioPlayer({ src, isSender }: AudioPlayerProps) {
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
      <button className={isSender ? 'text-[#8B503A]/90' : 'text-[#F2E5E4]'} onClick={togglePlayPause}>
        {isPlaying ? <PauseCircle height={30} width={30} /> : <Play height={30} width={30} />}
      </button>

      <div className="mx-2 w-full h-0.5 bg-gray-400 rounded overflow-hidden">
        <div
          ref={progressRef}
          className={`h-full ${isSender ? 'bg-[#8B503A]' : 'bg-[#F2E5E4]'} transition duration-150`}
        ></div>
      </div>
    </div>
  );
};
