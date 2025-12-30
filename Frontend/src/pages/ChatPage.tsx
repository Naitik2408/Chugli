// src/pages/ChatPage.tsx
import { useState, useEffect } from 'react';
import { RoomList } from '../components/RoomList';
import { ChatArea } from '../components/ChatArea';
import type { Room } from '../types';
import { apiService } from '../services/api';
import { socketService } from '../services/socket';
import { storage } from '../utils/storage';

export function ChatPage() {
  const [username, setUsername] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSetup, setIsSetup] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // On mount: restore session AND request location in parallel for faster UX
  useEffect(() => {
    // Start session restoration
    const restoreSession = async () => {
      const stored = storage.getSession();
      if (stored) {
        // Validate session with backend
        const validated = await apiService.validateSession(stored.sessionId);
        if (validated) {
          setUsername(stored.username);
          setUsernameInput(stored.username);
          setIsSetup(true);
          console.log('✅ Session restored:', stored.username);
        } else {
          // Session expired on backend
          storage.clearSession();
          console.log('⚠️ Session expired, cleared');
        }
      }
    };

    // Start location request
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationError(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocationError(true);
            // Do NOT set default location - force user to grant permission
          }
        );
      } else {
        setLocationError(true);
      }
    };

    // Run both in parallel
    restoreSession();
    requestLocation();
  }, []);

  useEffect(() => {
    if (username && userLocation) {
      // Set loading state immediately for better UX
      setLoadingRooms(true);
      
      socketService.connect();
      
      // Handle socket errors (including room expiry)
      socketService.onError((error: any) => {
        if (error.code === 'ROOM_EXPIRED') {
          alert('This room has expired. Join another chugli.');
          setSelectedRoom(null);
          storage.clearRoom();
          loadNearbyRooms();
        } else {
          console.error('Socket error:', error);
        }
      });

      // Load rooms immediately
      const storedRoom = storage.getRoom();
      
      // Fetch nearby rooms once
      apiService.getNearbyRooms(userLocation.lat, userLocation.lng)
        .then(nearbyRooms => {
          setRooms(nearbyRooms);
          setLoadingRooms(false);
          
          // Auto-rejoin if there was a stored room
          if (storedRoom && !selectedRoom) {
            const room = nearbyRooms.find(r => r.roomId === storedRoom.roomId);
            if (room) {
              handleSelectRoom(room);
              console.log('✅ Auto-rejoined room:', room.name);
            } else {
              storage.clearRoom();
              console.log('⚠️ Stored room not found, cleared');
            }
          }
        })
        .catch(err => {
          console.error('Failed to load rooms:', err);
          setLoadingRooms(false);
          if (storedRoom) {
            storage.clearRoom();
          }
        });

      return () => {
        socketService.offError();
        socketService.disconnect();
      };
    }
  }, [username, userLocation]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    // Block if no location permission
    if (!userLocation) {
      setSessionError('Location permission is required to use Chugli');
      return;
    }

    try {
      const session = await apiService.createSession(usernameInput);
      
      // Save to localStorage
      storage.saveSession(session.sessionId, usernameInput);
      
      setUsername(usernameInput);
      setIsSetup(true);
      setSessionError(null);
      console.log('✅ Session created:', session.sessionId);
    } catch (error) {
      console.error('Failed to create session:', error);
      setSessionError('Failed to create session. Please try again.');
    }
  };

  const loadNearbyRooms = async () => {
    if (!userLocation) return;

    setLoadingRooms(true);
    try {
      const nearbyRooms = await apiService.getNearbyRooms(userLocation.lat, userLocation.lng);
      setRooms(nearbyRooms);
      console.log(`📍 Loaded ${nearbyRooms.length} nearby rooms`);
    } catch (error) {
      console.error('Failed to load nearby rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleCreateRoom = async (name: string, lat: number, lng: number) => {
    try {
      await apiService.createRoom(name, lat, lng);
      // Room list will be refreshed via onRefreshRooms
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error; // Re-throw to show error in modal
    }
  };

  const handleSelectRoom = async (room: Room) => {
    try {
      await apiService.joinRoom(room.roomId);
      setSelectedRoom(room);
      storage.saveRoom(room.roomId); // Save for auto-rejoin on refresh
      setShowMobileChat(true); // Show chat area on mobile
      console.log('✅ Joined room:', room.name);
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room. Please try again.');
    }
  };

  const handleBackToRooms = () => {
    setShowMobileChat(false);
  };

  if (!isSetup) {
    return (
      <div className="min-h-screen flex items-center bg-[#1a1a1a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 sm:py-12">
          {/* Left side - Content */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-tight">
                Impossible?<br />
                Possible.
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mt-4 sm:mt-6">
                Connect with people nearby
              </p>
            </div>
            <div className="max-w-md space-y-4">
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
                
                {locationError && (
                  <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
                    📍 Location permission required. Please enable location access and refresh the page.
                  </div>
                )}
                
                {sessionError && (
                  <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
                    {sessionError}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={!usernameInput.trim() || locationError}
                  className="w-full px-6 py-4 text-base font-medium text-black bg-white rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Chatting
                </button>
              </form>
            </div>
          </div>
          
          {/* Right side - Visual */}
          <div className="hidden lg:block">
            <div className="relative w-full h-150 bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-end justify-center pb-0">
                <div className="relative w-[80%] h-[85%] bg-linear-to-t from-orange-700 to-orange-600 rounded-t-[200px]" />
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
      <div className="flex h-full max-w-full lg:max-w-400 mx-auto">
        {/* Desktop: Show both side by side */}
        {/* Mobile: Show RoomList OR ChatArea based on showMobileChat */}
        <div className={`w-full lg:w-80 shrink-0 ${
          showMobileChat ? 'hidden lg:flex' : 'flex'
        }`}>
          <RoomList
            selectedRoom={selectedRoom}
            onSelectRoom={handleSelectRoom}
            userLocation={userLocation}
            onCreateRoom={handleCreateRoom}
            onRefreshRooms={loadNearbyRooms}
            rooms={rooms}
            loading={loadingRooms}
          />
        </div>
        <div className={`flex-1 ${
          !showMobileChat ? 'hidden lg:flex' : 'flex'
        }`}>
          <ChatArea 
            room={selectedRoom} 
            username={username}
            onBack={handleBackToRooms}
          />
        </div>
      </div>
    </div>
  );
}
