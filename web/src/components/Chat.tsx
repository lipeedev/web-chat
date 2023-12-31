import { SendHorizonal } from "lucide-react";
import { ChatMessage, ChatMessageData } from "./ChatMessage";
import { useEffect, useState } from "react";
import { VoiceRecorder } from "./VoiceRecorder";

export interface WebSocketMessage {
  message: string;
  sender: string;
  isTyping?: boolean;
  isAudio?: boolean
  profileImage: string | null
}

interface ChatProps {
  username: string;
  room: string;
  profileImage: string | null;
}

export function Chat({ profileImage, username, room }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [currentVoiceMsg, setCurrentVoiceMsg] = useState<WebSocketMessage | null>(null)
  const [textAreaHeight, setTextAreaHeight] = useState('auto');

  useEffect(() => {
    if (currentVoiceMsg) {
      const chunks: string[] = []
      const chunkSize = 1024
      const base64AudioString = currentVoiceMsg.message

      for (let i = 0; i < base64AudioString.length; i += chunkSize) {
        chunks.push(base64AudioString.slice(i, i + chunkSize));
      }

      chunks.forEach(chunk => {
        socket?.send(JSON.stringify({ ...currentVoiceMsg, message: [chunk], isChunkEnd: false }))
      })

      socket?.send(JSON.stringify({ ...currentVoiceMsg, message: null, isChunkEnd: true }))

    }
  }, [currentVoiceMsg])

  useEffect(() => {
    if (socket) return;

    const newSocket = new WebSocket(`${import.meta.env.VITE_API_URL.replace('http', 'ws')}/chat/${room}/${username}`);

    newSocket.onmessage = event => {
      const data = JSON.parse(event.data) as WebSocketMessage

      if (data.isTyping) {
        if (!usersTyping.includes(data.sender)) {
          setUsersTyping(prev => [... new Set([...prev, data.sender])]);
          setTimeout(() => setUsersTyping(prev => prev.filter(user => user !== data.sender)), 2000);
        }

        return;
      }

      setMessages(prev => [...prev, {
        content: data.message,
        sender: data.sender,
        isSender: false,
        isServer: data.sender === 'server',
        isAudio: data.isAudio,
        profileImage: data.profileImage
      }]);
    }

    setSocket(newSocket);

    return () => {
      newSocket.close()
    }

  }, [])

  const sendMessage = () => {
    if (!newMessage.trim().length) {
      setNewMessage('');
      return;
    }

    if (socket) {
      setMessages(prev => [...prev, { content: newMessage, isSender: true, sender: username, profileImage }]);
      socket.send(JSON.stringify({ message: newMessage, sender: username, isTyping: false, isAudio: false, profileImage }));
      setNewMessage('');
      setTextAreaHeight('auto')
    }

  }

  const handleTyping = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value)

    if (textAreaHeight !== "144px") {
      autoAdjustTextArea(event.target)
    }

    if (!newMessage.length) {
      setTextAreaHeight("auto")
    }

    socket?.send(JSON.stringify({ message: '', sender: username, isTyping: true, isAudio: false }));
  }

  const autoAdjustTextArea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setTextAreaHeight(`${textarea.scrollHeight}px`);
  };

  return (
    <div className="py-2 px-4 pb-14 flex flex-col rounded-lg h-screen">
      <div className="mb-1 overflow-x-hidden overflow-y-scroll flex flex-col">
        {(messages.length > 0) && messages.map((data, index) => (
          <ChatMessage
            key={index}
            isSender={data.isSender}
            message={data}
            animate={index === messages.length - 1}
            isServer={data.isServer}
            isLastMsgFromSender={messages[index - 1]?.sender === data.sender && !data.isServer}
          />
        ))}
      </div>

      <div className="h-2 mt-5">
        {
          (usersTyping.length > 0) && <p className="text-[#D6CAB3] text-sm">{usersTyping.length > 3 ? 'several people' : usersTyping.join(' & ')} is typing...</p>
        }
      </div>

      <div className="relative pt-1 flex mt-auto items-center">
        <textarea
          value={newMessage}
          onChange={handleTyping}
          placeholder="Message..."
          rows={1}
          style={{ height: textAreaHeight }}
          className="text-[#4A2C21] placeholder:text-[#4A2C21] border-none focus:outline-none py-3 px-4 bg-gradient-to-l from-[#D99F84] to-[#7D8074] w-full rounded-3xl"
        />

        <button className="mr-10 absolute right-0" onClick={sendMessage}>
          <SendHorizonal height={24} width={24} className="text-[#F2D6C9] cursor-pointer" />
        </button>

        <VoiceRecorder profileImage={profileImage} setCurrentVoiceMsg={setCurrentVoiceMsg} sender={username} setMessages={setMessages} />
      </div>

    </div >
  )
}
