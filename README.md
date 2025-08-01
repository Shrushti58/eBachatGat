# eBachat Gat 💰  
*A Digital Platform for Managing Traditional Indian Savings Groups (Bachat Gats)*

---

## 🌟 Features

- Role-based access control (Admin, Treasurer, President, Secretary, Member)
- Member registration, contribution tracking, and savings overview
- Loan request and approval workflow with document uploads (Cloudinary)
- Treasurer dashboard with records, collections, and PDF report generation
- Secretary calendar with FullCalendar.js for recurring meeting management
- President approval system for new members and loans
- Online payment support (Razorpay - test mode)
- Interactive dashboards with charts and summaries
- Clean UI with notifications (Toastify)
- RESTful API with JWT-based authentication

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Toastify
- FullCalendar.js

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### Cloud & Integrations
- Razorpay API (test mode)
- Cloudinary (for document uploads)

---

## 📁 Monorepo Structure

```bash
eBachat-Gat/
├── backend/          # Express.js backend with routes, models, controllers
├── frontend/         # React.js frontend with Tailwind CSS
└── README.md         # Project documentation
