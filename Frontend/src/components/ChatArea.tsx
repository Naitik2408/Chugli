// src/components/ChatArea.tsx
import { useState, useEffect, useRef } from 'react';
import type { Room, Message } from '../types';

interface ChatAreaProps {
  room: Room | null;
  username: string;
}

// Mock messages for UI testing
const generateMockMessages = (roomId: string, currentUser: string): Message[] => {
  const otherUsers = ['Alice', 'Bob', 'Charlie', 'Dave'];
  const sampleTexts = [
    'Hey everyone! 👋',
    'Anyone up for coffee?',
    'This is a great spot!',
    'See you all tomorrow',
    'Thanks for the chat!',
  ];

  return Array.from({ length: 5 }, (_, i) => ({
    messageId: `msg-${roomId}-${i}`,
    roomId,
    username: i % 2 === 0 ? currentUser : otherUsers[i % otherUsers.length],
    text: sampleTexts[i],
    timestamp: Date.now() - (5 - i) * 60000,
  }));
};

export function ChatArea({ room, username }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!room) return;

    // Load mock messages for the room
    const mockMessages = generateMockMessages(room.roomId, username);
    setMessages(mockMessages);

    return () => {
      setMessages([]);
    };
  }, [room, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !room) return;

    // Add message to local state (mock)
    const newMessage: Message = {
      messageId: `msg-${Date.now()}`,
      roomId: room.roomId,
      username,
      text: inputText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  if (!room) {
    return (
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        <div className="flex-1 flex flex-col justify-center items-center">
          <h2 className="text-4xl mb-3 text-white font-serif">Welcome to Chugli 💬</h2>
          <p className="text-gray-400 text-lg">Select a room from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
      <div className="p-5 bg-[#1a1a1a] border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-1">{room.name}</h2>
        <div className="text-sm text-gray-400">
          📍 {room.lat.toFixed(4)}, {room.lng.toFixed(4)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.messageId}
              className={`mb-4 flex flex-col ${
                message.username === username ? 'items-end' : 'items-start'
              }`}
            >
              <div className={`flex gap-2 mb-1 text-xs ${
                message.username === username ? 'flex-row-reverse text-gray-400' : 'text-gray-500'
              }`}>
                <span className="font-semibold">{message.username}</span>
                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className={`max-w-[60%] px-4 py-3 rounded-2xl shadow-md break-words ${
                message.username === username
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                  : 'bg-[#2a2a2a] text-white border border-gray-700'
              }`}>
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="flex gap-3 p-4 bg-[#1a1a1a] border-t border-gray-800" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-5 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-base text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
