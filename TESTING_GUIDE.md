# Quick Start Guide - Testing Full Integration

## Prerequisites
1. **Redis Server** must be running
   ```bash
   # On macOS
   brew services start redis
   
   # On Linux
   sudo systemctl start redis
   
   # Or run directly
   redis-server
   ```

2. **Verify Redis is running**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

## Start the Application

### Terminal 1 - Backend
```bash
cd Backend
npm install  # First time only
npm run dev
```

Expected output:
```
Server running on http://localhost:3000
Socket.IO attached successfully
```

### Terminal 2 - Frontend
```bash
cd Frontend
npm install  # First time only
npm run dev
```

Expected output:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Testing the Complete Flow

### 1. Open First User Session
1. Navigate to `http://localhost:5173`
2. Enter username: `Alice`
3. Click "Start Chatting"
4. Allow location access (or it will use default Chandigarh coordinates)

### 2. Create Your First Room
1. Click the **"Create Room"** button (orange button in sidebar)
2. Enter room name: `Coffee Shop Chat`
3. See your location displayed
4. Click **"Create Room"**
5. Modal closes and room appears in the list

### 3. Open Second User Session (New Incognito Window)
1. Open a new incognito/private browser window
2. Navigate to `http://localhost:5173`
3. Enter username: `Bob`
4. Click "Start Chatting"
5. You should see "Coffee Shop Chat" in the nearby rooms list (if within 5km)

### 4. Join and Chat
**User 1 (Alice):**
1. Click on "Coffee Shop Chat" room
2. Type message: "Hey, anyone here?"
3. Press Send

**User 2 (Bob):**
1. Click on "Coffee Shop Chat" room
2. See Alice's message appear in real-time
3. Type message: "Hi Alice! 👋"
4. Press Send

**User 1 (Alice):**
- See Bob's message appear instantly

### 5. Test Room Discovery
**User 1 (Alice):**
1. Click **"Create Room"** again
2. Create another room: `Tech Meetup`

**User 2 (Bob):**
1. Click the refresh button (🔄) in sidebar
2. See both rooms: "Coffee Shop Chat" and "Tech Meetup"

## Running Tests

### Backend Tests
```bash
cd Backend
npm test
```

Expected: All tests pass ✓
```
 PASS  tests/unit/session.test.ts
 PASS  tests/unit/room.test.ts
 PASS  tests/unit/room-nearby.test.ts
 PASS  tests/unit/room-join.test.ts
 PASS  tests/unit/room-create.test.ts
 PASS  tests/integration/room-flow.test.ts
```

### Frontend Tests
```bash
cd Frontend
npm install vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui --save-dev
npm test
```

Expected: All tests pass ✓

## Common Issues & Solutions

### Issue: "Failed to create session"
**Solution:** Make sure backend is running on port 3000
```bash
curl http://localhost:3000/session -X POST -H "Content-Type: application/json" -d '{"username":"test"}'
```

### Issue: "No rooms nearby"
**Solutions:**
1. Check if location permission is granted
2. Create a room first
3. Check Redis is running: `redis-cli ping`
4. Verify room was created: `redis-cli SMEMBERS active-rooms`

### Issue: "Messages not appearing"
**Solutions:**
1. Check browser console for Socket.IO errors
2. Verify Socket.IO connection: Look for "Socket.IO attached successfully" in backend logs
3. Check if you joined the room (orange left border should appear)
4. Open browser DevTools → Network → WS to see WebSocket connection

### Issue: "Can't connect to backend"
**Solution:** 
1. Check `.env.local` in Frontend:
   ```
   VITE_API_URL=http://localhost:3000
   ```
2. Restart frontend dev server after creating/changing `.env.local`

## Debugging Tips

### Check Backend Health
```bash
# Test session creation
curl -X POST http://localhost:3000/session \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'

# Test room creation
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Room","lat":30.7333,"lng":76.7794}'

# Test nearby rooms
curl "http://localhost:3000/rooms/nearby?lat=30.7333&lng=76.7794"
```

### Check Redis Data
```bash
# See all active rooms
redis-cli SMEMBERS active-rooms

# Get specific room data
redis-cli GET "room:ROOM_ID"

# Clear all data (if needed)
redis-cli FLUSHALL
```

### Monitor Backend Logs
Look for these key messages:
- ✓ `Server running on http://localhost:3000`
- ✓ `Socket.IO attached successfully`
- ✓ `User {username} joined room {roomId}`
- ✓ `Message sent in room {roomId}`

### Monitor Browser Console
Look for these key events:
- ✓ `Socket connected`
- ✓ `Joined room: {roomId}`
- ✓ `Message received`

## Success Criteria

- [ ] Backend starts without errors
- [ ] Frontend starts and loads landing page
- [ ] Can create user session
- [ ] Can create new room with modal
- [ ] Room appears in nearby rooms list
- [ ] Can join room (orange accent appears)
- [ ] Can send messages
- [ ] Messages appear in real-time for all users
- [ ] Can refresh rooms list
- [ ] Can switch between rooms
- [ ] All backend tests pass
- [ ] All frontend tests pass

## Next Steps

Once the basic flow works:
1. Test with actual GPS coordinates on mobile device
2. Test with multiple users in different locations
3. Test edge cases (network disconnection, etc.)
4. Performance testing with many rooms/messages
5. Deploy to production environment

## Support

If you encounter issues:
1. Check logs in both backend and frontend
2. Verify all prerequisites are met
3. Clear Redis data and restart both servers
4. Check browser console for detailed errors
