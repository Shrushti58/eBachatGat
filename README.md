# eBachat Gat 🏦  
**Digitizing Traditional Indian Savings Groups**  

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
*A React + Node.js platform for managing Bachat Gats with payments, meetings, and role-based access.*

---

## 📌 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Installation](#-installation)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features
- **Role-Based Access Control**  
  - Admin, Treasurer, President, Secretary, Member roles
- **Financial Management**  
  - Member contributions tracking  
  - Loan disbursement/repayment  
- **Meeting Coordination**  
  - Schedule meetings with FullCalendar.js  
  - Automated reminders  
- **Document Management**  
  - Upload receipts/agreements to Cloudinary  
- **Payment Integration**  
  - Razorpay test mode for transactions  
- **Reporting**  
  - Generate PDF reports of group activities  

---

## 🛠 Tech Stack
**Frontend**  
| React.js | Tailwind CSS | Axios | React Toastify | FullCalendar.js |  
**Backend**  
| Node.js | Express.js | MongoDB | Mongoose | JWT Authentication |  
**Cloud Services**  
| Razorpay API | Cloudinary | MongoDB Atlas |  

---

## 📁 Project Structure
```bash
ebachat-gat/
├── frontend/               # React Vite App
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI
│   │   ├── pages/          # Route pages
│   │   ├── utils/          # Helpers/config
│   │   └── App.jsx         # Main app
│   └── package.json
└── backend/                # Express Server
    ├── config/             # DB/cloud configs
    ├── controllers/        # Route handlers
    ├── models/             # MongoDB schemas
    ├── routes/             # API endpoints
    ├── middleware/         # Auth/validation
    └── server.js           # Entry point

  ---

## 🔧 Environment Setup
Create a `.env` file inside the `backend/` folder with the following:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ebachat
JWT_SECRET=your_jwt_secret_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxx
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=xxxxxxxxxx
