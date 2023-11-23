import { useEffect, useRef, useState } from "react";

export function VideoChat() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const urlExample = 'https://www.ebookfrenzy.com/ios_book/movie/movie.mov';

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/video", ["websocket", "compress"]);

    ws.onmessage = (event) => {
      const wsData = JSON.parse(event.data);

      if (wsData.event === 'play') {
        videoRef.current?.play();
      }

      if (wsData.event === 'pause') {
        videoRef.current?.pause();
      }

      if (wsData.event === 'timeChange' && !seeking) {
        setCurrentTime(wsData.data.currentTime);
        videoRef.current!.currentTime = wsData.data.currentTime;
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [seeking]);

  const handlePlay = () => {
    socket?.send(JSON.stringify({ event: 'play' }));
  };

  const handlePause = () => {
    socket?.send(JSON.stringify({ event: 'pause' }));
  };

  const handleTimeChange = () => {
    const newCurrentTime = videoRef.current?.currentTime;

    if (newCurrentTime !== undefined && Math.abs(newCurrentTime - currentTime) > 1) {
      setCurrentTime(newCurrentTime);
      socket?.send(
        JSON.stringify({
          event: 'timeChange',
          data: {
            currentTime: newCurrentTime,
          },
        })
      );
    }
  };

  const handleSeeking = () => {
    setSeeking(true);
  };

  const handleSeeked = () => {
    setSeeking(false);
  };

  const handleMetadataLoaded = () => {
    videoRef.current!.play()
    videoRef.current!.currentTime = currentTime;
  };

  return (
    <video
      ref={videoRef}
      src={urlExample}
      preload="auto"
      controls
      onPlay={handlePlay}
      onPause={handlePause}
      onTimeUpdate={handleTimeChange}
      onSeeking={handleSeeking}
      onSeeked={handleSeeked}
      onLoadedMetadata={handleMetadataLoaded}
    />
  );
}

