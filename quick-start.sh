#!/bin/bash

# Chugli - Quick Start Script
# This script installs dependencies for both backend and frontend

set -e  # Exit on error

echo "🚀 Chugli - Quick Start Installation"
echo "===================================="
echo ""

# Check if Redis is running
echo "📋 Checking prerequisites..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "⚠️  WARNING: Redis is not running!"
    echo "   Please start Redis first:"
    echo "   - macOS: brew services start redis"
    echo "   - Linux: sudo systemctl start redis"
    echo "   - Manual: redis-server"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Redis is running"
fi

# Install Backend dependencies
echo ""
echo "📦 Installing Backend dependencies..."
cd Backend
npm install
echo "✅ Backend dependencies installed"

# Install Frontend dependencies
echo ""
echo "📦 Installing Frontend dependencies..."
cd ../Frontend
npm install
echo "✅ Frontend dependencies installed"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating Frontend .env.local file..."
    cat > .env.local << EOF
VITE_API_URL=http://localhost:3000
EOF
    echo "✅ Frontend .env.local created"
fi

cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Start Backend:  cd Backend && npm run dev"
echo "   2. Start Frontend: cd Frontend && npm run dev"
echo "   3. Open browser:   http://localhost:5173"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - SETUP.md - Complete setup guide"
echo "   - TESTING_GUIDE.md - Testing instructions"
echo "   - INTEGRATION_SUMMARY.md - Feature overview"
echo ""
echo "Happy chatting! 💬"
