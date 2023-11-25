import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import axios, { AxiosResponse } from "axios";
import { ChevronLeft } from "lucide-react";

interface Room {
  name: string
}

export function App() {
  const [username, setUsername] = useState<string>('');
  const [currentRoom, setCurrentRoom] = useState<string>('')
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    axios.get('http://localhost:8080/api/rooms')
      .then(({ data }: AxiosResponse<Room[]>) => setRooms(data))
      .catch(console.error)
  }, [])

  const handleJoinRoom = (roomName: string) => {
    if (!username) return
    setCurrentRoom(roomName)
  }

  const handleQuitRoom = () => {
    setCurrentRoom('')
    setUsername('')
  }

  return (
    <div>
      <div className={`mx-3 my-1 ${!currentRoom && 'flex justify-center'}`}>
        {
          !currentRoom
            ? <input className="bg-yellow-100/20 rounded-md p-4 text-white placeholder-gray-300" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            : (
              <button onClick={handleQuitRoom}>
                <ChevronLeft height={30} width={30} className="text-yellow-300" />
              </button>
            )
        }
      </div>

      <div className={!currentRoom ? 'm-4 gap-2 grid grid-cols-3' : ''}>
        {(rooms.length > 0 && !currentRoom) && rooms.map((room, index) => <button key={index} className="p-4 bg-yellow-300/60 text-gray-300 rounded-lg" onClick={() => handleJoinRoom(room.name)}>{room.name}</button>)}
        {currentRoom && <Chat username={username} room={currentRoom} />}
      </div>
    </div>
  )

}
