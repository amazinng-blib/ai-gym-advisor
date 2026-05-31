import { Router } from 'express';
import authRoutes from './authRoutes';
import planRoutes from './planRoutes';
import profileRoutes from './profileRoutes';

const router = Router();

// Routes
router.use('/auth', authRoutes);
router.use('/plan', planRoutes);
router.use('/profile', profileRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
