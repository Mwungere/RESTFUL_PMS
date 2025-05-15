# Parking Management System API

A RESTful API for managing car parking registrations with user authentication and admin controls.

## Features

- User authentication (JWT)
- Two user roles: client and admin
- Car registration management
- Status updates for car registrations
- Input validation
- Secure password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/parking_management
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new client
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "plateNumber": "ABC-123"
  }
  ```

- POST `/api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Vehicles

- GET `/api/vehicles/my-vehicles` - Get client's vehicle registrations (requires client auth)
- GET `/api/vehicles` - Get all vehicle registrations (requires admin auth)
- POST `/api/vehicles/register` - Register a new vehicle (requires client auth)
- PATCH `/api/vehicles/:id/status` - Update vehicle registration status (requires admin auth)
  ```json
  {
    "status": "accepted" // or "rejected" or "pending"
  }
  ```

## Authentication

Include the JWT token in the Authorization header for protected routes:
```
Authorization: Bearer <your_token_here>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:

```json
{
  "message": "Error message here"
}
```

or for validation errors:

```json
{
  "errors": [
    {
      "msg": "Error message here",
      "param": "field_name"
    }
  ]
}
``` 