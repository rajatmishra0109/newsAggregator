#!/bin/bash
# Installation and Setup Script for ArticleHub

echo "🚀 ArticleHub Setup Script"
echo "=========================="
echo ""

# Check Python
echo "✓ Checking Python..."
python --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "✗ Python not found. Please install Python 3.8+"
    exit 1
fi

# Check Node.js
echo "✓ Checking Node.js..."
node --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "✗ Node.js not found. Please install Node.js 14+"
    exit 1
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "✗ Failed to install backend dependencies"
    exit 1
fi
echo "✓ Backend dependencies installed"
cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "✗ Failed to install frontend dependencies"
    exit 1
fi
echo "✓ Frontend dependencies installed"
cd ..

echo ""
echo "⚙️  Configuration Check..."
if [ ! -f "backend/.env" ]; then
    echo "✗ backend/.env not found"
    exit 1
fi

if grep -q "your_gemini_api_key_here" backend/.env; then
    echo "⚠️  WARNING: Gemini API key not configured!"
    echo "   Please update backend/.env with your API key"
    echo "   Get free key from: https://aistudio.google.com"
else
    echo "✓ Configuration looks good"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   python app.py"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open Browser:"
echo "   http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Full guide"
echo "   - QUICKSTART.md - Quick setup"
echo "   - GEMINI_SETUP.md - API key help"
echo ""
