import { SendHorizonal } from "lucide-react";
import { ChatMessage, ChatMessageData } from "./components/ChatMessage";
import { useEffect, useState } from "react";

export function App() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080/');

    newSocket.onmessage = event => {
      const data = event.data as string;
      setMessages(prev => [...prev, { message: data, isSender: false }]);
    }

    setSocket(newSocket);

    return () => {
      newSocket.close();
    }

  }, [])

  const sendMessage = () => {
    if (!newMessage) return;

    if (socket) {
      setMessages(prev => [...prev, { message: newMessage, isSender: true }]);
      socket.send(newMessage);
      setNewMessage('');
    }

  }

  return (
    <div className="mx-2 my-10 p-4 bg-zinc-900/60 flex flex-col rounded-lg h-screen">

      <div className="overflow-auto gap-3 flex flex-col">
        {messages.map((data, index) => (
          <ChatMessage key={index} isSender={data.isSender} message={data.message} animate={index === messages.length - 1} />
        ))}
      </div>

      <div className="relative py-3 flex mt-auto items-center">
        <input
          value={newMessage}
          onChange={event => setNewMessage(event.target.value)}
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
