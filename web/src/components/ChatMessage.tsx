import { BadgeInfo } from "lucide-react";
import { animated, useSpring } from "react-spring";

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
}

export function ChatMessage({ profileImg = '/default.png', message, animate = true, isSender, isServer = false, isLastMsgFromSender }: ChatMessageProps) {
  const animation = useSpring({
    from: { opacity: 0, transform: isSender ? 'translateX(20px)' : 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    immediate: !animate,
  });

  const colorSender = 'bg-yellow-300/40 text-white'
  const colorReceiver = `${isServer ? 'bg-yellow-300/20' : 'bg-yellow-100/20'} text-gray-200`
  if (isServer) {
    message.sender = message.sender[0].toUpperCase() + message.sender.slice(1)
  }

  return (
    <animated.div style={animation} className={`mx-1 gap-2 flex ${isSender && 'flex-row-reverse'} ${isLastMsgFromSender ? 'mt-1' : 'mt-3'}`}>
      {(!isServer && !isLastMsgFromSender) && <img src={profileImg} className="h-9 w-9 rounded-full mt-2" />}
      {(!isServer && isLastMsgFromSender) && <div className="w-9" />}

      <div className={`${isSender ? colorSender : colorReceiver} py-2 px-3 rounded-2xl flex flex-col gap-1 max-w-md`}>
        <div className="flex justify-between">
          <span className='font-bold text-md'>{message.sender}</span>
          {isServer && <BadgeInfo className="text-yellow-200" />}
        </div>

        <div className="flex gap-4">
          <p className="whitespace-normal break-words text-gray-100">{message.content.trim()}</p>
          <span className="self-end text-gray-300 text-xs">{new Date().toLocaleTimeString('pt-br', { timeStyle: 'short' })}</span>
        </div>
      </div>
    </animated.div>
  )
}
