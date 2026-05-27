// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import routes from './routes';
// import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = parseInt(process.env.PORT || '5000');
// const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// // Middleware
// app.use(cors({ origin: CORS_ORIGIN }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api', routes);

// // 404 handler
// app.use(notFoundHandler);

// // Error handler (must be last)
// app.use(errorHandler);

// // Initialize database and start server
// const startServer = async () => {
//   try {
//     // Start server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//       console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
//     });
//   } catch (error) {
//     console.error('❌ Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer();

// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const appPort = process.env.PORT ?? 6200;

// app.listen(appPort, () => {
//   console.log(`App listening on :http://localhost:${appPort}`);
// });

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDB } from './config/database';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import router from './routes/index';

app.use('/api/v1', router);

app.use(errorHandler);
app.use(notFoundHandler);

const appPort = process.env.PORT ?? 6200;

const startServer = async () => {
  await connectToDB(); // connect to DB first
  app.listen(appPort, () => {
    console.log(`🚀 App listening on http://localhost:${appPort}`);
  });
};

startServer();
