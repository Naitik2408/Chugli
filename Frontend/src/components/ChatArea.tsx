// src/components/ChatArea.tsx
import { useState, useEffect, useRef } from 'react';
import type { Room, Message } from '../types';
import { socketService } from '../services/socket';
import Spinner from './Spinner';

interface ChatAreaProps {
  room: Room | null;
  username: string;
  onBack?: () => void;
  onLogout?: () => void;
  logoutLoading?: boolean;
}

export function ChatArea({ room, username, onBack, onLogout, logoutLoading = false }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!room) return;

    // Join the room via Socket.IO
    socketService.joinRoom(room.roomId, username);

    // Listen for new messages
    socketService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Handle errors (rate limit, etc.)
    socketService.onError((error: any) => {
      if (error.code === 'RATE_LIMIT') {
        alert('Please wait a moment before sending another message.');
      } else if (error.code === 'MESSAGE_TOO_LONG') {
        alert('Message too long (max 300 characters).');
      }
      setSending(false);
    });

    return () => {
      socketService.leaveRoom(room.roomId);
      socketService.offMessage();
      socketService.offError();
      setMessages([]);
    };
  }, [room, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !room || sending) return;

    setSending(true);
    // Send message via Socket.IO
    socketService.sendMessage(room.roomId, username, inputText);
    setInputText('');
    
    // Reset sending state after 1 second (matches rate limit)
    setTimeout(() => setSending(false), 1000);
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

  const charCount = inputText.length;
  const maxChars = 300;

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] w-full">
      <div className="p-4 sm:p-5 bg-[#1a1a1a] border-b border-gray-800">
        <div className="flex items-center gap-3">
          {/* Back button - visible on mobile only */}
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
              aria-label="Back to rooms"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-1 truncate">{room.name}</h2>
            <div className="text-xs sm:text-sm text-gray-400 truncate">
              📍 {room.lat.toFixed(4)}, {room.lng.toFixed(4)}
            </div>
          </div>
          {/* Logout button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="ml-3 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm hidden sm:inline-flex cursor-pointer"
              aria-disabled={logoutLoading}
            >
              {logoutLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner size={14} />
                  <span>Logging out</span>
                </span>
              ) : (
                'Logout'
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 p-4 sm:p-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.messageId}
              className={`mb-3 sm:mb-4 flex flex-col ${
                message.username === username ? 'items-end' : 'items-start'
              }`}
            >
              <div className={`flex gap-2 mb-1 text-xs ${
                message.username === username ? 'flex-row-reverse text-gray-400' : 'text-gray-500'
              }`}>
                <span className="font-semibold">{message.username}</span>
                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[60%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-md wrap-break-word ${
                message.username === username
                  ? 'bg-linear-to-br from-orange-500 to-orange-600 text-white'
                  : 'bg-[#2a2a2a] text-white border border-gray-700'
              }`}>
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-[#1a1a1a] border-t border-gray-800" onSubmit={handleSend}>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={maxChars}
            className="w-full px-3 sm:px-5 py-2 sm:py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors pr-12 sm:pr-16"
          />
          <div className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs ${
            charCount > maxChars - 50 ? 'text-orange-400' : 'text-gray-500'
          }`}>
            {charCount}/{maxChars}
          </div>
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || sending || charCount > maxChars}
          className="px-4 sm:px-8 py-2 sm:py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm sm:text-base font-medium hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {sending ? (
            <span className="flex items-center gap-2">
              <Spinner size={14} />
              <span>Sending...</span>
            </span>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  );
}
