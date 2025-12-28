// Quick Socket.IO messaging test
// Run with: node test-messaging.js

import { io } from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:3000';
const SOCKET_URL = 'http://localhost:3000';

console.log('🧪 Testing cross-browser messaging...\n');

// Step 1: Create a test room
async function createTestRoom() {
  try {
    const { data } = await axios.post(`${API_URL}/rooms`, {
      name: 'Test Room',
      lat: 30.7333,
      lng: 76.7794
    });
    console.log('✅ Test room created:', data.roomId);
    return data.roomId;
  } catch (err) {
    console.error('❌ Failed to create room:', err.message);
    process.exit(1);
  }
}

// Step 2: Test messaging
async function testMessaging() {
  const testRoomId = await createTestRoom();
  
  // Simulate Browser 1
  const client1 = io(SOCKET_URL, { transports: ['websocket'] });
  // Simulate Browser 2
  const client2 = io(SOCKET_URL, { transports: ['websocket'] });

  client1.on('connect', () => {
    console.log('✅ Client 1 connected:', client1.id);
    
    // Client 1 joins room
    client1.emit('join_room', { roomId: testRoomId, username: 'Alice' });
    
    client1.on('joined_room', (data) => {
      console.log('✅ Client 1 joined room:', data.roomId);
    });
    
    // Client 1 listens for messages
    client1.on('receive_message', (msg) => {
      console.log('📨 Client 1 received:', msg.username, '→', msg.message);
      
      // Success! Close connections
      setTimeout(() => {
        console.log('\n🎉 Test passed! Messages broadcast correctly.\n');
        client1.close();
        client2.close();
        process.exit(0);
      }, 500);
    });
  });

  client2.on('connect', () => {
    console.log('✅ Client 2 connected:', client2.id);
    
    // Client 2 joins same room
    client2.emit('join_room', { roomId: testRoomId, username: 'Bob' });
    
    client2.on('joined_room', (data) => {
      console.log('✅ Client 2 joined room:', data.roomId);
      
      // Client 2 sends message after joining
      setTimeout(() => {
        console.log('📤 Client 2 sending message...');
        client2.emit('send_message', { roomId: testRoomId, message: 'Hello from Bob!' });
      }, 100);
    });
    
    // Client 2 also listens (should receive own message)
    client2.on('receive_message', (msg) => {
      console.log('📨 Client 2 received:', msg.username, '→', msg.message);
    });
  });

  client1.on('error', (err) => console.error('❌ Client 1 error:', err));
  client2.on('error', (err) => console.error('❌ Client 2 error:', err));

  // Timeout if test doesn't complete
  setTimeout(() => {
    console.error('\n❌ Test timeout - check if backend is running\n');
    process.exit(1);
  }, 10000);
}

testMessaging();
