# Codify - Interactive Coding Education Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-orange.svg)](https://socket.io/)

> **The platform where every aspiring coder can thrive** - Transform challenges into achievements through gamified, interactive coding education.

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [🎯 User Roles](#-user-roles)
- [📊 API Documentation](#-api-documentation)
- [🎮 Features Deep Dive](#-features-deep-dive)
- [🔒 Security](#-security)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Overview

**Codify** is a next-generation Learning Management System (LMS) specifically designed for coding education. It combines traditional educational tools with modern gamification elements, real-time collaboration, and interactive coding environments to create an engaging learning experience.

### 🎯 Mission
To democratize coding education by providing institutions with a comprehensive platform that makes learning programming languages engaging, competitive, and accessible.

### 🌐 Live Demo
- **Platform**: [codifylms.vercel.app](https://codifylms.vercel.app)
- **API**: [api.codifylms.me](https://api.codifylms.me)

## ✨ Key Features

### 🎓 **Educational Core**
- **📚 Course Management**: Complete CRUD operations for courses, lessons, and activities
- **👨‍🏫 Multi-Role System**: Institution admin, professor, and student dashboards
- **📝 Assignment System**: Create, distribute, and grade coding assignments
- **📊 Progress Tracking**: Detailed analytics and progress monitoring
- **📅 Scheduling**: Integrated calendar system for events and deadlines

### 💻 **Interactive Coding Environment**
- **🖥️ Built-in Code Editor**: Monaco Editor with syntax highlighting
- **🌐 Multi-Language Support**: JavaScript, Python, Java, C++, C#, and C
- **▶️ Real-time Code Execution**: Instant code compilation and execution
- **🧪 Test Case Validation**: Automated testing with expected outputs
- **💾 Code Persistence**: Save and resume coding sessions

### 🏆 **Gamification & Competition**
- **⚔️ Code Battles**: Real-time 1v1 competitive coding matches
- **🏅 Achievement System**: Badges, XP points, and rankings
- **📈 Leaderboards**: Track student performance and engagement
- **🎖️ Custom Rewards**: Configurable achievement criteria
- **🎯 Challenge System**: Individual practice coding challenges

### 🔄 **Real-time Features**
- **🔔 Live Notifications**: Socket.io powered real-time updates
- **👥 Battle Lobbies**: Real-time battle matchmaking and spectating
- **📱 Instant Messaging**: Communication during collaborative sessions
- **🎥 Video Integration**: Built-in video conferencing capabilities

### 🛡️ **Security & Authentication**
- **🔐 JWT Authentication**: Secure token-based authentication
- **🌐 Google SSO**: Seamless Google OAuth integration
- **🔒 Role-based Access Control**: Granular permission management
- **🛡️ Firebase Integration**: Secure user management and file storage

## 🏗️ Architecture

Codify follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Admin Panel   │ │ Professor View  │ │  Student View   ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                                │
                         ┌─────────────┐
                         │   API Layer │
                         └─────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  Auth Service   │ │  Socket.io      │ │  File Upload    ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  Course Logic   │ │  Battle Engine  │ │  Email Service  ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │    MongoDB      │ │    Firebase     │ │   File Storage  ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### **Frontend**
- **⚛️ React 18.3.1** - Modern React with hooks and context
- **⚡ Vite 6.0.5** - Lightning-fast build tool and development server
- **🎨 Tailwind CSS 3.4.17** - Utility-first CSS framework
- **🧩 Radix UI** - Accessible, unstyled UI components
- **📱 Framer Motion** - Smooth animations and transitions
- **🏪 Zustand & Redux Toolkit** - Efficient state management
- **🔌 Socket.io Client** - Real-time communication
- **🖥️ Monaco Editor** - VS Code-powered code editor

### **Backend**
- **🟢 Node.js** - JavaScript runtime environment
- **🚀 Express.js 4.21.2** - Fast, minimalist web framework
- **📊 MongoDB with Mongoose** - NoSQL database with ODM
- **🔌 Socket.io 4.8.1** - Real-time bidirectional communication
- **🔥 Firebase Admin SDK** - Authentication and cloud storage
- **🔐 JWT** - JSON Web Token authentication
- **📧 Mailtrap** - Email testing and delivery
- **🔒 bcryptjs** - Password hashing
- **📁 Multer** - File upload middleware

### **Development & Deployment**
- **🌐 Vercel** - Frontend deployment
- **☁️ Cloud Hosting** - Backend deployment
- **🔄 Git** - Version control
- **📦 npm** - Package management
- **🔧 ESLint** - Code linting and formatting

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **MongoDB** database
- **Firebase** project setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/codify.git
cd codify
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Configure your environment variables (see Configuration section)
# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Configure your environment variables
# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: Default connection string in .env

## 📁 Project Structure

```
codify/
├── 📁 backend/                    # Node.js backend server
│   ├── 📁 config/                # Configuration files
│   ├── 📁 controllers/           # Route controllers
│   ├── 📁 database/              # Database connection
│   ├── 📁 middleware/            # Custom middleware
│   ├── 📁 models/                # Mongoose models
│   ├── 📁 routes/                # API routes
│   ├── 📁 utils/                 # Utility functions
│   ├── 📁 mailtrap/              # Email services
│   ├── 📁 uploads/               # File upload storage
│   ├── 📄 package.json           # Backend dependencies
│   └── 📄 index.js               # Server entry point
│
├── 📁 frontend/                   # React frontend application
│   ├── 📁 public/                # Static assets
│   ├── 📁 src/                   # Source code
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── 📁 admin-view/    # Admin-specific components
│   │   │   ├── 📁 professor-view/# Professor-specific components
│   │   │   ├── 📁 student-view/  # Student-specific components
│   │   │   └── 📁 ui/            # Shared UI components
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── 📁 admin-view-pages/
│   │   │   ├── 📁 professor-view-pages/
│   │   │   ├── 📁 student-view-pages/
│   │   │   └── 📁 Guest-view-pages/
│   │   ├── 📁 store/             # State management
│   │   ├── 📁 utils/             # Utility functions
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   ├── 📁 context/           # React contexts
│   │   └── 📁 Layout/            # Layout components
│   ├── 📄 package.json           # Frontend dependencies
│   └── 📄 vite.config.js         # Vite configuration
│
└── 📄 README.md                   # Project documentation
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/codify
DB_NAME=codify

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# Email Configuration (Mailtrap)
MAILTRAP_TOKEN=your_mailtrap_token
MAILTRAP_ENDPOINT=your_mailtrap_endpoint

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Origins
CLIENT_URL=http://localhost:5173
PRODUCTION_URL=https://yourdomain.com
```

### Frontend Environment Variables (.env)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🎯 User Roles

### 🏛️ **Institution Admin**
- **Dashboard Management**: Overview of all platform activities
- **User Management**: Add/remove professors and students
- **Course Oversight**: Monitor all courses and performance
- **Billing & Subscriptions**: Manage payment plans and billing
- **Analytics**: Institution-wide reporting and analytics
- **Settings**: Configure platform preferences and policies

### 👨‍🏫 **Professor**
- **Course Creation**: Design and structure courses with lessons
- **Content Management**: Upload materials, create activities
- **Student Monitoring**: Track student progress and performance
- **Assignment Grading**: Review and grade coding submissions
- **Battle Creation**: Set up competitive coding challenges
- **Communication**: Send announcements and feedback

### 👨‍🎓 **Student**
- **Course Access**: Enroll in and access course materials
- **Code Practice**: Use built-in editor for assignments
- **Battle Participation**: Join real-time coding competitions
- **Progress Tracking**: Monitor personal learning journey
- **Achievement Collection**: Earn badges and XP points
- **Schedule Management**: Organize study time and deadlines

## 📊 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register        # Register institution
POST /api/auth/login          # Login institution
POST /api/auth/google         # Google OAuth login
POST /api/auth/logout         # Logout user
POST /api/auth/verify-email   # Email verification
```

### Course Management
```http
GET    /api/courses           # Get all courses
POST   /api/courses           # Create new course
GET    /api/courses/:id       # Get course details
PUT    /api/courses/:id       # Update course
DELETE /api/courses/:id       # Delete course
```

### Battle System
```http
GET    /api/battles           # Get all battles
POST   /api/battles           # Create new battle
POST   /api/battles/join      # Join battle
POST   /api/battles/submit    # Submit battle solution
GET    /api/battles/:id/results # Get battle results
```

### Real-time Events (Socket.io)
```javascript
// Client-side events
socket.emit('joinBattleRoom', battleCode)
socket.emit('playerReady', { battleCode, studentId })
socket.emit('submitCode', { battleCode, code, language })

// Server-side events
socket.on('battleNotification', data)
socket.on('playerJoined', data)
socket.on('battleStarted', data)
socket.on('battleComplete', results)
```

## 🎮 Features Deep Dive

### ⚔️ **Code Battles**
Real-time competitive coding between students with:
- **Live Matchmaking**: Automatic opponent pairing
- **Multiple Languages**: Support for 6+ programming languages
- **Real-time Updates**: Live progress tracking during battles
- **Scoring System**: Time-based and accuracy-based scoring
- **Spectator Mode**: Watch ongoing battles
- **Battle History**: Complete match records and analytics

### 🖥️ **Code Editor**
Professional coding environment featuring:
- **Syntax Highlighting**: Language-specific code highlighting
- **Auto-completion**: Intelligent code suggestions
- **Error Detection**: Real-time syntax error highlighting
- **Multiple Themes**: Dark/light mode support
- **Code Formatting**: Automatic code beautification
- **File Management**: Save, load, and organize code files

### 🏆 **Gamification System**
Comprehensive engagement mechanics:
- **XP Points**: Earned through completed activities
- **Badge System**: 15+ different achievement badges
- **Leaderboards**: Class, course, and platform-wide rankings
- **Progress Streaks**: Daily and weekly activity tracking
- **Custom Rewards**: Configurable achievement criteria
- **Social Features**: Share achievements and compete with friends

### 📊 **Analytics Dashboard**
Detailed insights for all user roles:
- **Performance Metrics**: Code quality, completion rates, time tracking
- **Engagement Analytics**: Login frequency, session duration
- **Progress Reports**: Individual and group progress tracking
- **Battle Statistics**: Win/loss ratios, performance trends
- **Learning Paths**: Recommended courses and challenges
- **Custom Reports**: Exportable data for external analysis

## 🔒 Security

Codify implements enterprise-grade security measures:

### **Authentication & Authorization**
- **JWT Tokens**: Secure, stateless authentication
- **Role-based Access Control**: Granular permissions per user type
- **Session Management**: Automatic token refresh and expiration
- **Google OAuth**: Secure third-party authentication
- **Password Security**: bcrypt hashing with salt rounds

### **Data Protection**
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Content Security Policy headers
- **CORS Configuration**: Restricted cross-origin requests
- **Rate Limiting**: API request throttling
- **File Upload Security**: Type validation and size limits

### **Infrastructure Security**
- **HTTPS Enforcement**: SSL/TLS encryption
- **Environment Variables**: Secure configuration management
- **Database Security**: MongoDB Atlas with encryption
- **Firebase Security**: Secure cloud storage and authentication
- **Error Handling**: Secure error messages without data exposure

## 🚀 Deployment

### **Frontend Deployment (Vercel)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd frontend
vercel --prod
```

### **Backend Deployment Options**

#### **Option 1: Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy to Railway
cd backend
railway login
railway init
railway up
```

#### **Option 2: Heroku**
```bash
# Install Heroku CLI and deploy
cd backend
heroku create codify-backend
git push heroku main
```

#### **Option 3: DigitalOcean**
```bash
# Use DigitalOcean App Platform
# Connect your GitHub repository
# Configure environment variables
# Deploy via web interface
```

### **Database Deployment**
- **MongoDB Atlas**: Recommended cloud database solution
- **Firebase**: Used for authentication and file storage
- **Environment Variables**: Configure production URLs and secrets

### **Environment Configuration**
Update production environment variables:
```bash
# Production API URLs
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com

# Production database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codify

# Production CORS
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

We welcome contributions to Codify! Here's how you can help:

### **Getting Started**
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### **Contribution Guidelines**
- **Code Style**: Follow existing code formatting and conventions
- **Testing**: Ensure all tests pass and add tests for new features
- **Documentation**: Update README and inline documentation
- **Commit Messages**: Use clear, descriptive commit messages
- **Issue First**: For major changes, open an issue for discussion

### **Development Workflow**
1. **Setup Development Environment** (see Quick Start)
2. **Choose an Issue** from the issues board
3. **Create Feature Branch** from main
4. **Develop and Test** your changes
5. **Submit Pull Request** with detailed description

### **Areas for Contribution**
- 🐛 **Bug Fixes**: Report and fix issues
- 🚀 **New Features**: Implement requested features
- 📚 **Documentation**: Improve guides and API docs
- 🎨 **UI/UX**: Enhance user interface and experience
- 🔧 **Performance**: Optimize code and database queries
- 🧪 **Testing**: Add unit and integration tests

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Codify Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🌟 Acknowledgments

- **Monaco Editor** - For providing an excellent code editing experience
- **Socket.io** - For real-time communication capabilities
- **Firebase** - For authentication and cloud services
- **Radix UI** - For accessible, unstyled UI components
- **Tailwind CSS** - For rapid UI development
- **MongoDB** - For flexible, scalable database solutions

---

## 📞 Support

For support, questions, or suggestions:

- **📧 Email**: support@codifylms.me
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/codify/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/codify/discussions)
- **📖 Documentation**: [Project Wiki](https://github.com/yourusername/codify/wiki)

---

<div align="center">

**🚀 Built with ❤️ by the Codify Team**

[![Stars](https://img.shields.io/github/stars/yourusername/codify?style=social)](https://github.com/yourusername/codify)
[![Forks](https://img.shields.io/github/forks/yourusername/codify?style=social)](https://github.com/yourusername/codify)
[![Issues](https://img.shields.io/github/issues/yourusername/codify)](https://github.com/yourusername/codify/issues)

</div> 
