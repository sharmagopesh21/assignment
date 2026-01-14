# Job Management System

A full-stack application built with React, Vite, Express, and MongoDB.

**Live Website:** [https://assignment-gamma-rose.vercel.app/](https://assignment-gamma-rose.vercel.app/)

## Features
- Contractor and Agent dashboards.
- Job interested expression and management.
- Invoice and Payment tracking.

## Hosting Information
- **Frontend:** Hosted on [Vercel](https://vercel.com)
- **Backend:** Hosted on [Render](https://render.com)
- **Database:** Managed via [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)

## Project Work Flow
The application follows a streamlined lifecycle for property maintenance management:

1. **Job Creation**: An **Agent** posts a new job requirement with property details.
2. **Contractor Bidding**: **Contractors** browse open jobs and express interest by proposing a budget.
3. **Contractor Selection**: The **Agent** reviews interests and accepts a specific contractor for the job.
4. **Execution**: The assigned **Contractor** starts the work and marks it as completed once finished.
5. **Invoicing**: The **Contractor** submits an invoice with payment method details (e.g., Paytm/UPI).
6. **Payment Proof**: The **Agent** marks the payment as initiated.
7. **Completion & Receipt**: The **Contractor** confirms the payment and downloads an automated **PDF Receipt** as a permanent record.

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