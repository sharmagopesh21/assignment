# Job Management System

A full-stack application built with React, Vite, Express, and MongoDB.

## Features
- Contractor and Agent dashboards.
- Job interested expression and management.
- Invoice and Payment tracking.

## Getting Started Locally

### 1. Prerequisite
- Node.js installed.
- MongoDB Atlas account (or local MongoDB).

### 2. Backend Setup
1. Go to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file (copy from `.env.example`) and add your `MONGODB_URI`.
4. Start the server: `npm start` (or `npm run dev` for development).

### 3. Frontend Setup
1. Go to the root folder.
2. Install dependencies: `npm install`
3. (Optional) Create a `.env` file from `.env.example`.
4. Start the app: `npm run dev`

---

## Deployment & Hosting

### 1. Backend Deployment (e.g., Render, Railway)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB Atlas connection string.
  - `PORT`: 5000 (usually handled by the host).

### 2. Frontend Deployment (e.g., GitHub Pages, Vercel, Netlify)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`).

> [!IMPORTANT]
> Never upload your `.env` files to GitHub. Use the hosting provider's dashboard to set environment variables.
