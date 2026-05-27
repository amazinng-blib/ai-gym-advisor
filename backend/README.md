# Gym Suggestor - Backend API

A TypeScript Express backend API for the Gym Suggestor application with Sequelize ORM.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (Database, etc.)
│   ├── controllers/     # Route controllers/handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (auth, etc.)
│   ├── server.ts        # Main server file
│
├── dist/                # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── .env.example         # Environment variables template
└── .gitignore
```

## Installation

1. **Clone and navigate to backend folder:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   ```bash
   cp .env.example .env
   ```

   Fill in your database credentials in `.env`:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=gym_suggestor
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_DIALECT=postgres
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key_here_make_it_strong
   JWT_EXPIRE=7d
   ```

4. **Setup PostgreSQL Database:**

   ```sql
   CREATE DATABASE gym_suggestor;
   ```

## Scripts

- **Development:** `npm run dev` - Starts the server with hot reload
- **Build:** `npm run build` - Compiles TypeScript to JavaScript
- **Production:** `npm start` - Runs the compiled code

## API Endpoints

### Auth Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh authentication token

### Health Check

- `GET /api/health` - Server health status

## Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Sequelize** - SQL ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Development

The backend uses `ts-node-dev` for development with hot reloading. Any changes to TypeScript files will automatically restart the server.

```bash
npm run dev
```

The server automatically syncs database models on startup (in development mode).

## Building for Production

```bash
npm run build
npm start
```

This will compile TypeScript to JavaScript and run the compiled version.

## Environment Variables

See `.env.example` for all required environment variables.
