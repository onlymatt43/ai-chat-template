import { Router } from 'express';
import { sendMessage } from './chat.controller';

const router = Router();

// POST /api/chat
router.post('/', sendMessage);

export default router;

// ═══════════════════════════════════════════════════════════════
// 📝 UTILISATION DANS TON APP EXPRESS:
//
// import chatRouter from './chat.routes';
// app.use('/api/chat', chatRouter);
// ═══════════════════════════════════════════════════════════════
