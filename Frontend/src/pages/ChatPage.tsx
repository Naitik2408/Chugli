// src/pages/ChatPage.tsx
import { useState, useEffect } from 'react';
import { RoomList } from '../components/RoomList';
import { ChatArea } from '../components/ChatArea';
import type { Room } from '../types';

export function ChatPage() {
  const [username, setUsername] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSetup, setIsSetup] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 30.7333, lng: 76.7794 });
        }
      );
    }
  }, []);

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    // Mock session creation - no backend call
    setUsername(usernameInput);
    setIsSetup(true);
  };

  if (!isSetup) {
    return (
      <div className="min-h-screen flex items-center bg-[#1a1a1a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-8 lg:px-16 grid lg:grid-cols-2 gap-12 items-center py-12">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl lg:text-7xl font-serif leading-tight">
                Impossible?<br />
                Possible.
              </h1>
              <p className="text-xl text-gray-400 mt-6">
                Connect with people nearby
              </p>
            </div>
            <div className="max-w-md space-y-4 pt-4">
              <form onSubmit={handleSetup} className="space-y-4">
                <div className="bg-[#2a2a2a] rounded-xl border border-gray-700 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-6 py-4 text-base bg-transparent text-white placeholder-gray-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-4 text-base font-medium text-black bg-white rounded-xl hover:bg-gray-100 transition-all"
                >
                  Start Chatting
                </button>
              </form>
            </div>
          </div>
          
          {/* Right side - Visual */}
          <div className="hidden lg:block">
            <div className="relative w-full h-[600px] bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-end justify-center pb-0">
                <div className="relative w-[80%] h-[85%] bg-gradient-to-t from-orange-700 to-orange-600 rounded-t-[200px]" />
              </div>
              {/* Decorative elements - colorful dots */}
              <div className="absolute top-12 left-12 w-2 h-2 bg-teal-400 rounded-full" />
              <div className="absolute top-20 left-24 w-2 h-2 bg-green-400 rounded-full" />
              <div className="absolute top-32 left-32 w-2 h-2 bg-pink-400 rounded-full" />
              <div className="absolute top-16 right-20 w-2 h-2 bg-yellow-400 rounded-full" />
              <div className="absolute bottom-32 right-16 w-2 h-2 bg-purple-400 rounded-full" />
              <div className="absolute bottom-24 right-24 w-2 h-2 bg-red-400 rounded-full" />
              
              {/* Additional decorative curved line */}
              <svg className="absolute top-24 left-16 w-64 h-32 opacity-50" viewBox="0 0 200 100">
                <path
                  d="M 10 50 Q 60 10, 100 50 T 190 50"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0a]">
      <div className="flex h-full max-w-[1600px] mx-auto">
        <RoomList
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
          userLocation={userLocation}
        />
        <ChatArea room={selectedRoom} username={username} />
      </div>
    </div>
  );
}