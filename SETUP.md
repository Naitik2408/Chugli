# Chugli - Location-Based Chat Application

A real-time chat application that connects people within a 5km radius.

## Features

- 🔐 **Session Management**: Create user sessions with unique usernames
- 📍 **Location-Based Rooms**: Create and discover chat rooms based on geolocation
- 💬 **Real-Time Chat**: WebSocket-based messaging with Socket.IO
- 🎨 **Modern UI**: Dark theme with orange gradient accents
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

### Backend
- **Node.js** with **TypeScript** (ES Modules)
- **Express.js** for REST API
- **Socket.IO** for real-time communication
- **Redis** (ioredis) for data persistence
- **Jest** for testing

### Frontend
- **React 19** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **Socket.IO Client** for real-time features
- **Axios** for HTTP requests
- **Vitest** for testing

## Project Structure

```
Chugli/
├── Backend/
│   ├── src/
│   │   ├── config/          # Configuration (Redis, TTL)
│   │   ├── middlewares/     # Express middlewares
│   │   ├── modules/
│   │   │   ├── session/     # Session management
│   │   │   └── room/        # Room CRUD operations
│   │   ├── sockets/         # Socket.IO handlers
│   │   ├── utils/           # Utility functions (distance calc)
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   └── tests/
│       ├── unit/            # Unit tests
│       └── integration/     # Integration tests
│
└── Frontend/
    ├── src/
    │   ├── components/      # React components
    │   │   ├── RoomList.tsx
    │   │   ├── ChatArea.tsx
    │   │   └── CreateRoomModal.tsx
    │   ├── pages/           # Page components
    │   ├── services/        # API and Socket services
    │   ├── types/           # TypeScript types
    │   └── router/          # React Router setup
    └── __tests__/           # Frontend tests

```

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Redis** server running locally or remotely

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (optional):
   ```env
   PORT=3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Run tests:
   ```bash
   npm test
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Usage Flow

1. **Enter Username**: On landing page, enter your username and click "Start Chatting"
2. **Create Room**: Click the "Create Room" button in the sidebar
3. **Enter Room Details**: Provide a room name (your location is auto-detected)
4. **Browse Nearby Rooms**: See all rooms within 5km radius
5. **Join & Chat**: Click on any room to join and start chatting in real-time

## API Endpoints

### Sessions
- `POST /session` - Create a new user session

### Rooms
- `POST /rooms` - Create a new room
- `GET /rooms/nearby?lat={lat}&lng={lng}` - Get nearby rooms (5km radius)
- `POST /rooms/:roomId/join` - Join a specific room

### WebSocket Events
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message to a room
- `receive-message` - Receive messages from a room

## Testing

### Backend Tests
```bash
cd Backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
```

### Frontend Tests
```bash
cd Frontend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:ui            # UI mode
```

## Development Notes

### Backend
- Uses ES modules with explicit `.js` extensions in imports
- Redis mock mode for tests (NODE_ENV=test)
- Session TTL: 2 hours
- Room discovery radius: 5km

### Frontend
- Mock data mode available for UI development
- Dark theme with `#1a1a1a` background
- Orange gradient (`from-orange-500 to-orange-600`) for accents
- Responsive design with Tailwind CSS

## Environment Variables

### Backend
- `PORT` - Server port (default: 3000)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `NODE_ENV` - Environment (development/test/production)

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

MIT
