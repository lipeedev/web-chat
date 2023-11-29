import { BadgeInfo } from "lucide-react";
import { animated, useSpring } from "react-spring";
import { AudioPlayer } from "./AudioPlayer";

interface ChatMessageProps {
  message: ChatMessageData;
  animate?: boolean;
  isSender?: boolean;
  isServer?: boolean;
  isTyping?: boolean;
  isLastMsgFromSender?: boolean;
  profileImg?: string;
}

export interface ChatMessageData {
  isSender: boolean;
  sender: string;
  content: string;
  isServer?: boolean;
  isAudio?: boolean;
}

export function ChatMessage({ profileImg = '/default.png', message, animate = true, isSender, isServer = false, isLastMsgFromSender }: ChatMessageProps) {
  const animation = useSpring({
    from: { opacity: 0, transform: isSender ? 'translateX(20px)' : 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    immediate: !animate,
  });

  const colorSender = `bg-yellow-300/40 text-white ${!isLastMsgFromSender ? 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl' : 'rounded-2xl'}`
  const colorReceiver = `${isServer ? 'bg-yellow-300/20' : 'bg-yellow-100/20'} ${(!isLastMsgFromSender && !isServer) ? 'rounded-bl-2xl rounded-br-2xl rounded-tr-2xl' : 'rounded-2xl'} text-gray-200`
  if (isServer) {
    message.sender = message.sender[0].toUpperCase() + message.sender.slice(1)
  }

  return (
    <animated.div style={animation} className={`mx-1 gap-2 flex ${isSender && 'flex-row-reverse'} ${isLastMsgFromSender ? 'mt-1' : 'mt-3'} ${isServer && 'justify-center'}`}>
      {(!isServer && !isLastMsgFromSender) && <img src={profileImg} className="h-9 w-9 rounded-full" />}
      {(!isServer && isLastMsgFromSender) && <div className="w-9" />}

      <div className={`${isSender ? colorSender : colorReceiver} py-2 px-3 flex flex-col gap-1 ${message.isAudio && 'w-full'}`}>
        <div className="flex justify-between">
          {!isSender && <span className='font-bold text-md'>{message.sender}</span>}
          {isServer && <BadgeInfo className="text-yellow-200" />}
        </div>

        <div className="flex justify-between">
          {
            !message.isAudio
              ? <p className="pr-4 whitespace-normal break-words text-gray-100">{message.content.trim()}</p>
              : <AudioPlayer src={message.content} />
          }
          <span className="self-end text-gray-300 text-xs">{new Date().toLocaleTimeString('pt-br', { timeStyle: 'short' })}</span>
        </div>
      </div>
    </animated.div>
  )
}
