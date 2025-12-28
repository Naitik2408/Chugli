# Chugli 💬

> A real-time, location-based chat application that connects people within a 5km radius

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

## ✨ Features

- 🔐 **Session Management** - 2-hour session TTL with localStorage persistence
- 📍 **Location-Based Discovery** - Find chat rooms within 5km radius using geolocation
- 💬 **Real-Time Chat** - Instant messaging powered by Socket.IO WebSockets
- 🎨 **Modern UI** - Dark theme with orange gradient accents, fully responsive
- 🚀 **Room Creation** - Create public rooms visible to nearby users
- ⚡ **Fast & Scalable** - Redis-powered data storage with TTL management
- 🔄 **Auto-Rejoin** - Seamless room reconnection on page refresh (within 2-hour TTL)
- 🛡️ **Rate Limiting** - 1 message/second spam protection with 300 char limit
- 📱 **Session Persistence** - Continue where you left off within 2 hours
- ⚠️ **Room Expiry Handling** - Clear feedback when rooms expire (2-hour TTL)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Redis server
- Modern web browser with geolocation support

### Installation

Run the quick-start script:

```bash
./quick-start.sh
```

Or install manually:

```bash
# Install backend dependencies
cd Backend && npm install

# Install frontend dependencies
cd ../Frontend && npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend  
npm run dev
```

**Open your browser:**
```
http://localhost:5173
```

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup and configuration guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Step-by-step testing instructions
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Feature overview and architecture
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Session persistence & product rules implementation
- **[MANUAL_TEST_GUIDE.sh](./MANUAL_TEST_GUIDE.sh)** - Cross-browser messaging verification guide

## 🎯 Usage

1. **Enter Username** - Provide your username on the landing page
2. **Allow Location** - Grant geolocation permission (required - no fallback)
3. **Browse Rooms** - See all rooms within 5km in the sidebar
4. **Create Room** - Click "Create Room" button and enter room details
5. **Join & Chat** - Click any room to join and start chatting in real-time
6. **Refresh Anytime** - Session persists for 2 hours; room auto-rejoins on refresh

### Product Rules

- **Session TTL**: 2 hours (auto-expires, stored in localStorage)
- **Room TTL**: 2 hours (Redis auto-deletes expired rooms)
- **Rate Limiting**: 1 message per second per user
- **Message Limit**: 300 characters maximum
- **Location**: Required to proceed (no default coordinates)
- **Refresh Behavior**: Within 2 hours → seamless continuation | After 2 hours → new session

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript** (ES Modules)
- **Express.js** - REST API framework
- **Socket.IO** - Real-time bidirectional communication
- **Redis** (ioredis) - In-memory data store
- **Jest** - Testing framework

### Frontend
- **React 19** with **TypeScript**
- **Vite** - Next generation frontend tooling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Socket.IO Client** - WebSocket client
- **Axios** - HTTP client
- **Vitest** - Unit test framework

## 📂 Project Structure

```
Chugli/
├── Backend/
│   ├── src/
│   │   ├── config/          # Redis, TTL configuration
│   │   ├── middlewares/     # Express middlewares
│   │   ├── modules/
│   │   │   ├── session/     # Session management
│   │   │   └── room/        # Room CRUD & discovery
│   │   ├── sockets/         # Socket.IO event handlers
│   │   ├── utils/           # Utility functions
│   │   ├── app.ts           # Express app
│   │   └── server.ts        # Entry point
│   └── tests/               # Unit & integration tests
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API & Socket services
│   │   ├── types/           # TypeScript types
│   │   └── router/          # Routing configuration
│   └── __tests__/           # Frontend tests
│
├── SETUP.md                 # Setup guide
├── TESTING_GUIDE.md         # Testing instructions
├── INTEGRATION_SUMMARY.md   # Feature documentation
└── quick-start.sh           # Installation script
```

## 🧪 Testing

### Backend Tests
```bash
cd Backend
npm test                # Run all tests
npm run test:watch      # Watch mode
```

### Frontend Tests
```bash
cd Frontend
npm install            # Install test dependencies
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Interactive UI
```

## 🔌 API Endpoints

### Sessions
- `POST /session` - Create user session

### Rooms
- `POST /rooms` - Create new room
- `GET /rooms/nearby?lat={lat}&lng={lng}` - Get nearby rooms (5km)
- `POST /rooms/:roomId/join` - Join room

### WebSocket Events
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send message to room
- `receive-message` - Receive room messages

## 🌐 Environment Variables

### Backend (`.env`)
```env
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=development
```

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by location-based social networking
- Designed for real-time communication

---

**Made with ❤️ by the Chugli Team**
