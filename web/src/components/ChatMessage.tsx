import { animated, useSpring } from "react-spring";

interface ChatMessageProps {
  message: string;
  animate?: boolean;
  isSender?: boolean;
  isServer?: boolean;
  isTyping?: boolean;
}

export interface ChatMessageData {
  isSender: boolean;
  sender: string;
  message: string;
  isServer?: boolean;
}

export function ChatMessage({ message, animate = true, isSender, isServer = false }: ChatMessageProps) {
  const animation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    immediate: !animate,
  });

  const colorSender = 'bg-yellow-300/40 text-white'
  const colorReceiver = 'bg-yellow-300/20 text-gray-200'

  return (
    <animated.div style={animation} className={`mx-1 flex gap-1 ${isSender ? 'flex-row-reverse' : ''}`}>
      {
        !isServer && <img src="https://github.com/lipeedev.png" className="h-10 w-10 rounded-full" />
      }

      <div className={`${isSender ? colorSender : colorReceiver} py-2 px-3 rounded-2xl`}>
        {message}
      </div>
    </animated.div>
  )
}
