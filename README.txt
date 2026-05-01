Team Task Manager (Full-Stack)


Submission

Live URL: https://task-manager-production-cb9a.up.railway.app/login
Demo Video: https://drive.google.com/file/d/1f93vR_YnKJZ6tx0fLF80KjUtNhQW_ZP6/view?usp=forms_web
GitHub Repository: https://github.com/ARMAANSIDDIQUI/Task-Manager.git


Demo Access

Admin Role:
- Email: armaansiddiqui.pms@gmail.com
- Password: admin123

Member Role:
- Email: a@gmail.com
- Password: 123456

Overview

The Team Task Manager is a full-stack web application designed to support collaborative project management with role-based access control. It allows users to create projects, assign tasks, and monitor progress in a structured and efficient manner.

The system focuses on providing a balance between usability and functionality, enabling both administrators and team members to perform their responsibilities with minimal friction.

Features

Authentication and Authorization
- Secure user authentication (Signup and Login)
- Role-based access control (Admin and Member) using JWT

Project and Team Management
- Admins can create and manage projects
- Ability to add and manage team members
- Centralized control over project activities

Task Management
- Create, assign, and update tasks
- Track task status (Pending, In Progress, Completed)
- Inline status updates for quick modifications

Dashboard and Monitoring
- Overview of all tasks within a project
- Identification of overdue tasks
- Sorting based on creation date and deadlines

Session Management
- Persistent login sessions using JWT (valid for up to 7 days)

Tech Stack

Frontend: React (with Vite)
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JSON Web Token
UI: Lucide

System Architecture

- RESTful API design
- Separation of frontend and backend layers
- MongoDB schema design for users, projects, and tasks
- Middleware-based authentication and authorization

Deployment

The application is deployed using Railway.

Key aspects:
- Single-service deployment for frontend and backend
- Environment variable configuration for secure credentials
- Automated build and deployment via GitHub integration

Demo Access

Admin Role:
- Email: armaansiddiqui.pms@gmail.com
- Password: admin123

Member Role:
- Email: a@gmail.com
- Password: 123456

Local Setup

1. Install Dependencies
Run the following command in the root directory:
npm run install-all

2. Environment Configuration
Create a .env file in the backend directory and add:
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

3. Run the Application

Backend:
cd backend
npm start

Frontend:
cd frontend
npm run dev

