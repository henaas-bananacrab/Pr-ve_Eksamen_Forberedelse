# Helsebygg Frontend

A React web application for managing "avvik" (deviations/incidents) in a healthcare building system.

## Features

- User authentication (login/register)
- Dashboard to view all avvik
- Create new avvik
- View avvik details
- Admin functionality to update avvik status

## Tech Stack

- React 19
- React Router for navigation
- Axios for API calls
- CSS for styling

## API Integration

The frontend connects to a backend API running on `http://localhost:4020/api/v1` with the following endpoints:

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /avvik` - Get all avvik
- `GET /avvik/:id` - Get avvik by ID
- `POST /avvik` - Create new avvik
- `PUT /avvik/:id/status` - Update avvik status (admin only)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The application will be available at `http://localhost:5173`

## Backend Requirements

The backend API requires:
- MySQL database running on port 3306
- Environment variables configured (JWT_SECRET, database credentials)
- Tables: avvik, status, prioritering, kategori, avdeling, bruker

## Usage

1. Register a new account or login with existing credentials
2. View the dashboard with all avvik
3. Create new avvik using the form
4. Click on avvik cards to view details
5. Admin users can update avvik status from the detail view

## Components

- `Login.jsx` - User login form
- `Register.jsx` - User registration form
- `Dashboard.jsx` - Main dashboard with avvik list
- `CreateAvvik.jsx` - Form to create new avvik
- `AvvikDetail.jsx` - Detailed view of individual avvik
- `AuthContext.jsx` - Authentication state management
- `api.js` - API service functions
