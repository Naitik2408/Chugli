// src/components/RoomList.tsx
import { useState, useEffect } from 'react';
import type { Room } from '../types';

interface RoomListProps {
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  userLocation: { lat: number; lng: number } | null;
}

// Mock data for UI testing
const mockRooms: Room[] = [
  { roomId: '1', name: 'Night Chugli', lat: 30.7333, lng: 76.7794, createdAt: Date.now() },
  { roomId: '2', name: 'College Gossip', lat: 30.7335, lng: 76.7796, createdAt: Date.now() },
  { roomId: '3', name: 'Coffee Shop Chat', lat: 30.7330, lng: 76.7790, createdAt: Date.now() },
  { roomId: '4', name: 'Tech Meetup', lat: 30.7340, lng: 76.7800, createdAt: Date.now() },
  { roomId: '5', name: 'Book Club', lat: 30.7328, lng: 76.7788, createdAt: Date.now() },
];

export function RoomList({ selectedRoom, onSelectRoom, userLocation }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading rooms
    loadNearbyRooms();
  }, [userLocation]);

  const loadNearbyRooms = async () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setRooms(mockRooms);
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="w-80 flex flex-col bg-[#1a1a1a] text-white">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">Nearby Rooms</h2>
        </div>
        <div className="p-8 text-center text-gray-400">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="w-80 flex flex-col bg-[#1a1a1a] text-white border-r border-gray-800">
      <div className="p-5 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-1">Nearby Rooms</h2>
            <p className="text-xs text-gray-500">{rooms.length} rooms available</p>
          </div>
          <button
            onClick={loadNearbyRooms}
            className="p-2.5 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-all border border-gray-700 hover:border-gray-600"
            title="Refresh rooms"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <svg className="w-16 h-16 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No rooms nearby</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.roomId}
              className={`p-4 cursor-pointer border-b border-gray-800 transition-all hover:bg-[#2a2a2a] group ${
                selectedRoom?.roomId === room.roomId 
                  ? 'bg-[#2a2a2a] border-l-4 border-l-orange-500' 
                  : 'border-l-4 border-l-transparent'
              }`}
              onClick={() => onSelectRoom(room)}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-2.5 rounded-lg transition-colors ${
                  selectedRoom?.roomId === room.roomId 
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                    : 'bg-[#2a2a2a] group-hover:bg-[#3a3a3a]'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white mb-1.5 truncate">{room.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{room.lat.toFixed(4)}, {room.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
