# Instalite Backend

## Description

Instalite is a social media platform backend built with NestJS, MongoDB, and various other technologies such as ffmpeg, Gemini, etc... It provides a robust API for managing users, posts, likes, bookmarks, and file uploads. This project serves as the server-side component for a Instagram-like application, offering features such as user authentication, post creation and management, and social interactions.

Key features include:

- User authentication with JWT
- Post creation and management
- Like functionality
- Bookmark system
- File uploads (images for posts)
- Caching with Redis
- Logging with Winston
- Swagger API documentation

## Project Structure

The project follows a modular structure with the main components organized as follows:

- `src/`: Contains the main application code
  - `auth/`: Authentication-related modules and services
  - `bookmarks/`: Bookmark functionality
  - `files/`: File handling and uploads
  - `likes/`: Like functionality
  - `posts/`: Post-related modules and services
  - `users/`: User management
  - `notifications/`: Notification system
  - `search/`: Search functionality (placeholder for future implementation)
  - `config/`: Configuration files and environment variables
  - `constants/`: Constant values and enums
  - `gateway/`: WebSocket gateway
  - `global/`: Global modules and services

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v20.14.0 or later)
- npm (comes with Node.js)
- MongoDB
- Redis
- Docker
- ...

## Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd instalite_be
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file (template `.env.example`) in the root directory and add the necessary environment variables. Refer to the `baseConfig` in `src/config/base.config.ts` for the required variables.

## Before running the project

1. Start the Docker containers:

   ```bash
   docker-compose up -d
   ```

## Running the Project

1. Start the development server:

   ```bash
   npm run start:dev
   ```

   This will start the server in watch mode, automatically restarting on file changes.

2. For production:

   ```bash
   npm run build
   npm run start:prod
   ```

3. The server will start running on `http://localhost:8000` by default (unless specified otherwise in your `.env` file).

## API Documentation

Once the server is running, you can access the Swagger UI for API documentation:

- Open your browser and navigate to `http://localhost:8000/api`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
