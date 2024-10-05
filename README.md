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

### Project Structure

The monorepo contains the following main components:

- `apps/`: Contains the individual applications.
  - `instalite_be/`: The main backend application for the Instalite platform.
  - `notifications/`: A separate application for handling notifications.
- `libs/`: Contains shared libraries that can be used across applications.
  - `common/`: Common utilities, configurations, and services shared among applications.

This structure promotes modular development and allows teams to work on different parts of the application independently while still being part of the same codebase.

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

## Environment Variables

Each component of the project has its own environment variable example file (e.g., `.env.example`) that is specifically tailored for Docker configurations. These files are responsible for setting up the necessary environment variables when running the respective components in a Docker environment.

Additionally, there is a general environment variable example file located in the root directory, which is intended for local development. This file provides a template for the environment variables needed to run the application in a development setting.

Make sure to create your own `.env` files based on these examples and populate them with the appropriate values for your environment.

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

```

```
