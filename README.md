# 🤖 AI Chat Template

Template de chat AI réutilisable avec OpenAI GPT-4o-mini.

## 📁 Structure

```
├── backend/
│   ├── chat.service.ts      # Logique OpenAI
│   ├── chat.controller.ts   # Handler HTTP
│   └── chat.routes.ts       # Routes Express
│
└── frontend/
    ├── AIChat.tsx           # Composant UI
    └── chat.ts              # Client API
```

## 🚀 Installation

### Backend
```bash
npm install openai express
```

### Frontend
```bash
npm install lucide-react clsx axios
```

## 🔧 Configuration

### Variable d'environnement
```env
OPENAI_API_KEY=sk-proj-xxx
```

### Personnaliser le prompt
Modifie `SYSTEM_PROMPT` dans `chat.service.ts` selon ton projet.

## 📦 Intégration

### Backend (Express)
```typescript
import chatRouter from './routes/chat.routes';
app.use('/api/chat', chatRouter);
```

### Frontend (React)
```tsx
import { AIChat } from './components/AIChat';

const [chatOpen, setChatOpen] = useState(false);

<button onClick={() => setChatOpen(true)}>Ouvrir Chat</button>
<AIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
```

## 🎨 Personnalisation

- Modifier les couleurs dans `AIChat.tsx` (classes Tailwind)
- Changer le message de bienvenue dans `INITIAL_MESSAGE`
- Ajuster `max_tokens` et `temperature` dans le service
- Modifier l'historique gardé (actuellement 10 messages)

## 📝 API

### POST /api/chat
```json
{
  "message": "Bonjour",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Réponse
```json
{
  "data": {
    "response": "Salut ! Comment puis-je t'aider ?"
  }
}
```
