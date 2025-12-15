import type { Request, Response } from 'express';
import { chatService } from './chat.service';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message requis' });
    }

    const response = await chatService.chat(message, history || []);
    
    res.json({ data: { response } });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
};
