import { SendHorizonal } from "lucide-react";
import { ChatMessage, ChatMessageData } from "./ChatMessage";
import { useEffect, useState } from "react";

interface WebSocketMessage {
  message: string;
  sender: string;
  isTyping?: boolean;
}

interface ChatProps {
  username: string;
  room: string;
}

export function Chat({ username, room }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:8080/chat/${room}/${username}`);

    newSocket.onmessage = event => {
      const data = JSON.parse(event.data) as WebSocketMessage;

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
        isServer: data.sender === 'server'
      }]);
    }

    setSocket(newSocket);

    return () => {
      newSocket.close();
    }

  }, [])

  const sendMessage = () => {
    if (!newMessage.trim().length) {
      setNewMessage('');
      return;
    }

    if (socket) {
      setMessages(prev => [...prev, { content: newMessage, isSender: true, sender: username }]);
      socket.send(JSON.stringify({ message: newMessage, sender: username, isTyping: false }));
      setNewMessage('');
    }

  }

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value)
    socket?.send(JSON.stringify({ message: '', sender: username, isTyping: true }));
  }

  return (
    <div className="mx-2 mb-7 py-2 px-4 bg-zinc-900/60 flex flex-col rounded-lg h-screen">
      {
        (usersTyping.length > 0) && <p className="text-yellow-300 text-sm">{usersTyping.length > 3 ? 'several people' : usersTyping.join(' & ')} is typing...</p>
      }

      <div className="mb-1 overflow-x-hidden overflow-y-scroll gap-3 flex flex-col">
        {messages.length && messages.map((data, index) => (
          <ChatMessage key={index} isSender={data.isSender} message={data} animate={index === messages.length - 1} isServer={data.isServer} />
        ))}
      </div>

      <div className="relative pt-1 mb-2 flex mt-auto items-center">
        <input
          value={newMessage}
          onChange={handleTyping}
          placeholder="Digite a mensagem..."
          className="text-white border-none focus:outline-none py-3 px-4 bg-yellow-400/20 w-full rounded-full"
        />

        <button className="mx-3 absolute right-0" onClick={sendMessage}>
          <SendHorizonal height={24} width={24} className="text-yellow-100 cursor-pointer" />
        </button>
      </div>

    </div >
  )
}
