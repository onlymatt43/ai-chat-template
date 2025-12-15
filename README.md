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

# AI Chat Template

Un template complet pour intégrer un assistant AI marketing sur n'importe quel site (React, WordPress, mobile, etc.).

---

## Fonctionnalités
- Backend Express TypeScript (API /api/chat, intégration OpenAI)
- Frontend React (composant AIChat prêt à l'emploi)
- Facile à déployer sur Vercel, Render, Railway...
- Intégrable partout (iframe, React, API)

---

## Installation rapide

1. **Clone ce repo**
2. **Configure ta clé OpenAI**
  - Copie `.env.example` → `.env` dans `backend/`
  - Mets ta clé dans `OPENAI_API_KEY`
3. **Déploie le backend** (Vercel, Render, Railway...)
4. **Intègre le frontend**
  - Utilise le composant React OU l'API OU un iframe

---

## Backend

**Fichiers principaux :**
- `backend/chat.service.ts` : intégration OpenAI (modifie le prompt ici)
- `backend/chat.controller.ts` : controller Express
- `backend/chat.routes.ts` : routes à brancher dans ton app

**Démarrage local :**
```sh
cd backend
npm install
cp ../.env.example .env # puis mets ta clé
npm run dev
```

---

## Frontend

**Fichiers principaux :**
- `frontend/AIChat.tsx` : composant React complet
- `frontend/chat.ts` : client API Axios

**Utilisation dans un projet React :**
1. Copie `AIChat.tsx` et `chat.ts` dans ton projet
2. Change l'URL de l'API dans `chat.ts`
3. Utilise `<AIChat />` où tu veux

---

## Intégration sur n'importe quel site

### 1. **React**
```tsx
import AIChat from './AIChat';
// ...
<AIChat />
```

### 2. **iframe (WordPress, HTML, etc.)**
Déploie une page dédiée avec le chat, puis :
```html
<iframe src="https://ton-backend.vercel.app/ai-chat" width="400" height="600"></iframe>
```

### 3. **API Only**
Appelle `/api/chat` depuis n'importe quel frontend (mobile, Zapier, etc.)

---

## Personnalisation
- Modifie le prompt dans `chat.service.ts` pour adapter le style (vendeur, friendly, etc)
- Ajoute des hooks, analytics, etc.

---

## Dépendances principales
- openai
- express
- axios
- react
- lucide-react
- clsx

---

## Licence

MIT
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
