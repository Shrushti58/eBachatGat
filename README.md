# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

#!/bin/bash

# eBachat Gat Setup Script
echo "🚀 Setting up eBachat Gat - Digital Savings Group Platform"

# Clone repository
git clone https://github.com/yourusername/ebachat-gat.git
cd ebachat-gat

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install
cd ..

# Create environment files
echo "🔧 Creating environment files..."

# Server .env
cat > server/.env <<EOL
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=5000
NODE_ENV=development
EOL

# Client .env
cat > client/.env <<EOL
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
EOL

echo "✅ Environment files created. Please edit them with your actual credentials."

# Start the development servers
echo "⚡ Starting development servers..."
npm run dev

echo "🎉 Setup complete! Access the application at http://localhost:3000"
