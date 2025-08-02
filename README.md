# eBachat Gat - Digital Savings Group Platform

![eBachat Gat Banner](https://via.placeholder.com/1200x400?text=eBachat+Gat+-+Digital+Savings+Groups) <!-- Replace with actual screenshot -->

## 🌟 Overview
eBachat Gat is a full-stack platform that digitizes traditional Indian savings groups (Bachat Gats), enabling secure management of collective savings, loans, and meetings. The system modernizes these community banking systems while preserving their core social and financial principles.

## 🚀 Key Features

### 🔐 Role-Based Access Control
| Role        | Key Responsibilities                          |
|-------------|-----------------------------------------------|
| Admin       | User management, system configuration         |
| Treasurer   | Financial tracking, report generation        |
| President   | Loan approval/denial decisions               |
| Secretary   | Meeting scheduling and management            |
| Member      | Contributions, loans, document submission    |

### 💰 Financial Management
- Real-time savings tracking per member/group
- Loan request workflow with dual approval system
- Automated interest calculations
- Razorpay integration for digital payments (test mode)

### 📅 Meeting Management
- Interactive calendar interface (FullCalendar)
- Automated meeting reminders
- Attendance tracking

### 📄 Document Handling
- Secure document uploads (KYC, guarantor agreements)
- PDF report generation for financial statements
- Cloudinary integration for media storage

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: React Context API
- **UI Components**: HeadlessUI, React Icons
- **Calendar**: FullCalendar

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT (Cookie-based)
- **PDF Generation**: PDFKit
- **Payments**: Razorpay API

### Database
- **Primary DB**: MongoDB Atlas
- **ODM**: Mongoose

### DevOps
- **Environment Variables**: dotenv
- **Version Control**: Git

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB 6.0+
- Cloudinary account (for document storage)
- Razorpay test credentials

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ebachat-gat.git
   cd ebachat-gat

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
