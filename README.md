# 🚀 TaskManager: Team Collaboration Made Simple

A clean, functional, and professional MERN stack application designed for teams to manage projects, assign tasks, and track progress with ease.

---

## ✨ Key Features

- **User Authentication**: Secure signup and login with role-based access (Admin/Member).
- **Project Management**: Admins can create and manage team projects.
- **Task Tracking**: Create, edit, and delete tasks with status, priority, and due dates.
- **Visual Dashboard**: Get a birds-eye view of your productivity with task statistics and overdue alerts.
- **Clean UI**: A minimalist, distraction-free interface focused on getting things done.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT Authentication, Bcrypt password hashing.

---

## 📦 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### 1. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```
Start the server:
```bash
npm start
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📖 User Manual

### 1. Roles
- **Admin**: Can create new projects, manage all tasks, and see full team stats.
- **Member**: Can view projects they are part of and manage their assigned tasks.

### 2. Basic Workflow
1. **Signup**: Create an account and choose your role.
2. **Dashboard**: Upon logging in, see your task summary (Todo, In Progress, Completed).
3. **Projects**: Navigate to the Projects tab to see available work.
4. **Tasks**: Click on a project to view its "Task Board". Here you can add new tasks or update existing ones.

---

## 🌐 Deployment (Railway)

This project is ready for deployment on **Railway**.

1. **Database**: Create a MongoDB instance (e.g., Atlas).
2. **Backend**: 
   - Connect your repo to Railway.
   - Set the Root Directory to `backend`.
   - Add variables: `MONGO_URI`, `JWT_SECRET`, etc.
3. **Frontend**:
   - Connect the same repo.
   - Set the Root Directory to `frontend`.
   - Add variable: `VITE_API_URL` pointing to your backend.

---

## 👨‍💻 Developer Notes
This app was built with simplicity in mind. No over-engineered components—just reliable functionality and clean code. Every part of the app is commented to be easily understood by other developers.
