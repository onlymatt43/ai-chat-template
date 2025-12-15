import axios from 'axios';

// ═══════════════════════════════════════════════════════════════
// 🎯 CHANGE CETTE URL SELON TON BACKEND
// ═══════════════════════════════════════════════════════════════
const API_BASE_URL = 'http://localhost:4000'; // ou ton URL Vercel
// ═══════════════════════════════════════════════════════════════

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  data: {
    response: string;
  };
}

export const sendChatMessage = async (
  message: string,
  history: ChatMessage[] = []
): Promise<string> => {
  const response = await axios.post<ChatResponse>(
    `${API_BASE_URL}/api/chat`,
    {
      message,
      history: history.map(m => ({ role: m.role, content: m.content }))
    }
  );
  return response.data.data.response;
};
