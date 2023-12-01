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
}

export interface ChatMessageData {
  isSender: boolean;
  sender: string;
  content: string;
  isServer?: boolean;
  isAudio?: boolean;
  profileImage: string | null;
}

export function ChatMessage({ message, animate = true, isSender, isServer = false, isLastMsgFromSender }: ChatMessageProps) {
  const animation = useSpring({
    from: { opacity: 0, transform: isSender ? 'translateX(20px)' : 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    immediate: !animate,
  });

  const colorSender = `bg-gradient-to-l from-[#D99F84] to-[#F2D6C9] text-[#D99F84] ${!isLastMsgFromSender ? 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl' : 'rounded-2xl'}`
  const colorReceiver = `${isServer ? 'text-[#F2D6C9] bg-gradient-to-l from-teal-700/40  to-emerald-900/40' : 'bg-[#7D8074]/80 text-[#F2D6C9]'} ${(!isLastMsgFromSender && !isServer) ? 'rounded-bl-2xl rounded-br-2xl rounded-tr-2xl' : 'rounded-2xl'}`
  if (isServer) {
    message.sender = message.sender[0].toUpperCase() + message.sender.slice(1)
  }

  return (
    <animated.div style={animation} className={`mx-1 gap-2 flex ${isSender && 'flex-row-reverse'} ${isLastMsgFromSender ? 'mt-1' : 'mt-3'} ${isServer && 'justify-center'}`}>
      {(!isServer && !isLastMsgFromSender) && <img referrerPolicy="no-referrer" src={message.profileImage ?? "/default.png"} className="h-9 w-9 rounded-full" />}
      {(!isServer && isLastMsgFromSender) && <div className="w-9" />}

      <div className={`${isSender ? colorSender : colorReceiver} py-2 px-3 flex flex-col gap-1 ${message.isAudio && 'w-full'}`}>
        <div className="flex justify-between">
          {!isSender && <span className='font-bold text-md'>{message.sender}</span>}
          {isServer && <BadgeInfo className="text-[#D99F84]" />}
        </div>

        <div className="flex justify-betwe">
          {
            !message.isAudio
              ? <p className={`pr-4 break-all ${!isSender ? 'text-[#F2E5E4]' : 'text-[#613829]'}`}>{message.content.trim()}</p>
              : <AudioPlayer isSender={isSender} src={message.content} />
          }
          <span className={`self-end text-xs ${!isSender ? 'text-[#D6CAB3]' : 'text-[#8B503A]'}`}>{new Date().toLocaleTimeString('pt-br', { timeStyle: 'short' })}</span>
        </div>
      </div>
    </animated.div>
  )
}
