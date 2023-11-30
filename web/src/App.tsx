import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import axios, { AxiosResponse } from "axios";
import { ChevronLeft } from "lucide-react";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface Room {
  name: string
}

interface GoogleUserData {
    azp: string;
    email: string;
    email_verified: boolean,
    name: string;
    picture: string; 
    given_name: string
    family_name: string;
    locale: string
}

type GoogleDataUserJwtDecoded = JwtPayload & GoogleUserData

export function App() {
  const [username, setUsername] = useState<string>('');
  const [userAvatarSrc, setUserAvatarSrc] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string>('')
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/api/rooms')
      .then(({ data }: AxiosResponse<Room[]>) => setRooms(data))
      .catch(console.error)
  }, [])

  const handleJoinRoom = (roomName: string) => {
    if (!username) return
    setCurrentRoom(roomName)
  }

  const handleQuitRoom = () => {
    setCurrentRoom('')
  }

  const handleGoogleLogin = (response: CredentialResponse) => {
    if (!response.credential) return
    
    const userData = jwtDecode(response.credential) as GoogleDataUserJwtDecoded

    setUsername(userData.name)
    setUserAvatarSrc(userData.picture)
  }

  return (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <div>
      <div className={`mx-3 my-2 ${(!currentRoom && !username) && 'flex justify-center'}`}>
       {
          !currentRoom
            ? !username && <GoogleLogin onSuccess={handleGoogleLogin} text="signin" shape="circle" theme="filled_black" />
            : (
              <button onClick={handleQuitRoom}>
                <ChevronLeft height={30} width={30} className="text-yellow-300" />
              </button>
            )
        }
      </div>

      <div className={!currentRoom ? 'm-4 gap-2 grid grid-cols-3' : ''}>
        {(rooms.length > 0 && !currentRoom) && rooms.map((room, index) => <button key={index} className="p-4 bg-yellow-300/60 text-gray-100 rounded-lg" onClick={() => handleJoinRoom(room.name)}>{room.name}</button>)}
        {currentRoom && <Chat username={username} profileImage={userAvatarSrc} room={currentRoom} />}
      </div>
    </div>
    </GoogleOAuthProvider>
  )

}
