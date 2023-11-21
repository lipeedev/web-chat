import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";

export function App() {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    setUsername(prompt('Digite seu nome:') ?? 'anonimo');
  }, [])

  return (
    username && <Chat username={username} />
  )
}
