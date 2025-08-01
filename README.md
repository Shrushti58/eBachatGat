# eBachat Gat 💰  
**Digital Platform for Traditional Indian Savings Groups**  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📑 Table of Contents
- [Problem Statement](#problem-statement)
- [What is eBachat Gat](#what-is-ebachat-gat)
- [How We Solve the Problem](#how-we-solve-the-problem)
- [Key Features](#-key-features)
  - [For Members](#for-members)
  - [For Committee](#for-committee)
  - [For Admin](#for-admin)
- [User Access](#user-access)
- [Dashboards](#dashboards)
  - [Member Dashboard](#member-dashboard)
  - [Committee Dashboard](#committee-dashboard)
  - [Admin Dashboard](#admin-dashboard)
- [Live Demo](#live-demo)
- [Testing](#testing)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)

---

## Problem Statement
Traditional Indian savings groups (Bachat Gats) face challenges in:
- Manual record-keeping of contributions and loans
- Lack of transparency in financial transactions
- Difficulty in scheduling and tracking meetings
- No digital payment integration
- Inefficient communication between members

---

## What is eBachat Gat?
eBachat Gat is a digital platform that modernizes traditional savings groups by providing:
- Automated financial tracking
- Digital payment integration
- Meeting scheduling system
- Role-based access control
- Document management

![eBachat Gat Overview](./frontend/public/ebachat-overview.jpg)

---

## How We Solve the Problem
1. Members can track contributions, apply for loans, and make digital payments
2. Committee members (Treasurer, Secretary) can manage group finances and meetings
3. Admins oversee group operations and member management
4. Automated reminders for contributions and meetings
5. Digital record-keeping for complete transparency
6. Secure document storage for agreements and receipts

---

## ✨ Key Features

### For Members:
- Track personal contributions and loan status
- Make digital payments via Razorpay
- View meeting schedules and attendance
- Access group financial reports
- Receive automated reminders

### For Committee:
- Manage group finances and loans
- Schedule meetings and track attendance
- Generate financial reports (PDF)
- Approve loan applications
- Monitor member contributions

### For Admin:
- Manage group members and roles
- Oversee all financial transactions
- Configure group settings
- Access audit logs
- Manage document repository

---

## User Access
Users can log in with different roles: Member, Treasurer, Secretary, or Admin

![Registration Page](./frontend/public/register.png)

---

## Dashboards

### Member Dashboard
- View contribution history
- Check loan status
- See upcoming meetings
- Make digital payments

![Member Dashboard](./frontend/public/member-dash.png)

### Committee Dashboard
- Manage group finances
- Approve/reject loans
- Schedule meetings
- Generate reports

![Committee Dashboard](./frontend/public/committee-dash.png)

### Admin Dashboard
- Manage user roles
- Configure group settings
- View audit logs
- Manage documents

![Admin Dashboard](./frontend/public/admin-dash.png)

---

## Live Demo
https://ebachat-gat.netlify.app/

---

## Testing

| Role             | Email                  | Password  |
|------------------|------------------------|-----------|
| **Member**       | member@example.com     | member123 |
| **Treasurer**    | treasurer@example.com  | treas456  |
| **Admin**        | admin@example.com      | admin789  |

---

## 🛠️ Tech Stack

| Category       | Technologies Used |
|----------------|-------------------|
| **Frontend**   | React, Tailwind CSS, Axios |
| **Backend**    | Node.js, Express, MongoDB |
| **Services**   | Razorpay API, Cloudinary, JWT Auth |

---

## 🚀 Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/ebachat-gat.git
cd ebachat-gat
