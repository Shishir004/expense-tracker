# Expense Tracker

A full-stack MERN application for tracking personal expenses.

## Features

- Add, edit, and delete expenses
- Categorize expenses
- View expense summary with charts
- Responsive design

## Tech Stack

- MongoDB - Database
- Express - Backend framework
- React - Frontend library
- Node.js - Runtime environment
- Tailwind CSS - Styling

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Deployment

### Backend Deployment
1. Create a production build
2. Deploy to a hosting service like Heroku, Render, or Railway

### Frontend Deployment
1. Build the frontend:
   ```
   npm run build
   ```
2. Deploy the build folder to services like Netlify, Vercel, or GitHub Pages