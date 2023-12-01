import { MicIcon, StopCircle } from "lucide-react";
import { Dispatch, useState } from "react";
import { ReactMic, ReactMicStopEvent } from "react-mic";
import { ChatMessageData } from "./ChatMessage";
import { WebSocketMessage } from "./Chat";
import { blobToString } from "../utils/blobToString";

interface VoiceRecorderProps {
  setMessages: Dispatch<React.SetStateAction<ChatMessageData[]>>
  setCurrentVoiceMsg: Dispatch<React.SetStateAction<WebSocketMessage | null>>
  sender: string;
  profileImage: string | null
}

export function VoiceRecorder({ profileImage, setCurrentVoiceMsg, setMessages, sender }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)

  const onStop = async (recorded: ReactMicStopEvent) => {
    setIsRecording(false)

    const data: ChatMessageData = {
      sender,
      content: recorded.blobURL,
      isSender: true,
      isAudio: true,
      profileImage
    }

    setMessages(prev => [...prev, data])

    const content = await blobToString(recorded.blob)

    setCurrentVoiceMsg({
      isTyping: false,
      message: content,
      isAudio: true,
      sender: data.sender,
      profileImage
    })

  }

  return (
    <div className="flex gap-1 items-center">
      <ReactMic
        record={isRecording}
        onStop={onStop}
        className="w-0 h-0"
      />

      {
        isRecording
          ? <button onClick={() => setIsRecording(false)}><StopCircle height={26} width={26} className="text-[#F2D6C9]" /></button>
          : <button onClick={() => setIsRecording(true)}><MicIcon height={26} width={26} className="text-[#F2D6C9]" /></button>
      }
    </div>
  )
}
