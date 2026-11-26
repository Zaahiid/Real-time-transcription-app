import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth.js';
import { sessionRouter } from './session.js';
import { transcriptionsRouter } from './transcriptions.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

apiRouter.use('/session', sessionRouter);
apiRouter.use('/transcriptions', requireAuth, transcriptionsRouter);
