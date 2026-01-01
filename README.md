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

- `backend/chat.service.ts` : intégration OpenAI (modifie le prompt ici)
- `backend/chat.controller.ts` : controller Express
- `backend/chat.routes.ts` : routes à brancher dans ton app
- `backend/video.controller.ts` : endpoint pour générer des vidéos via ComfyUI ou WAN
- `backend/comfyui.client.ts` : client HTTP pour appeler `/run` sur ComfyUI/Modal/RunPods
- `backend/wan.client.ts` : client pour WAN 2.2
- `backend/upload.controller.ts` : endpoint pour présigner des uploads Backblaze B2
- `backend/index.ts` : point d’entrée Express (nécessaire pour Render)

## Déployer le backend sur Render et intégrer ComfyUI (GPU)

1. Créer le service sur Render
   - Connecte ton repo GitHub au dashboard Render.
   - Crée un nouveau service de type **Web Service** -> **Node**.
   - Sélectionne la branche `update-ai-dynamic` (ou `main`). Render utilisera `render.yaml` si présent.

2. Variables d'environnement (à ajouter dans Render -> Environment)
   - `OPENAI_API_KEY` (optionnel si tu utilises WAN à la place)
   - `OPENAI_MODEL` (ex: `gpt-4o-mini`)
   - `COMFYUI_API_URL` (URL publique de ton instance ComfyUI / Modal / RunPods)
   - `COMFYUI_API_KEY` (si requis par ton instance)
   - `DATABASE_URL` (si tu relies une DB)
   - `JWT_SECRET`

3. Intégrer ComfyUI (si tu héberges toi-même)
   - SSH sur ta machine GPU (Droplet / instance) et place-toi dans le répertoire où réside ComfyUI.
   - Execute `backend/scripts/install_comfyui_plugin.sh` pour cloner le plugin `comfyui-deploy` dans `custom_nodes`.
   - Redémarre ComfyUI si nécessaire.
   - Renseigne l’URL publique et la clé (si requise) dans Render (`COMFYUI_API_URL`, `COMFYUI_API_KEY`).

4. Générer une vidéo via l'API
   - Endpoint: `POST https://<TON_BACKEND>/api/video`
   - Body: soit `{ workflow: <full_workflow_json> }` soit `{ prompt, negative_prompt, img_url, parameters }`.
   - Si `VIDEO_PROVIDER=wan` ou que `WAN_API_KEY`/`WAN_API_URL` sont configurés, la requête sera envoyée à WAN 2.2 automatiquement.

5. Notes sécurité
   - **Ne commit jamais les secrets** (`OPENAI_API_KEY`, `WAN_API_KEY`, `COMFYUI_API_KEY`, `DB URL`, `JWT_SECRET`)
   - Stocke-les uniquement via l’UI Render (Environment -> Add Environment Variable) ou via secrets manager.

## WAN 2.2 (configuration rapide)
- Variables d'environnement (Render / .env) :
  - `WAN_API_KEY` = (Secret)
  - `WAN_API_URL` = (ex: `https://api.novita.ai/v3/async/wan-2.2-i2v`)
  - `VIDEO_PROVIDER` = `wan` (optionnel, forcera l'usage de WAN)

Exemple cURL pour lancer une génération (retourne `task_id` ou réponse selon le fournisseur) :

```sh
curl -s -X POST "$WAN_API_URL" \
  -H "Authorization: Bearer $WAN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":{"prompt":"A small cat running on the grass","img_url":"https://example.com/frame.png","parameters":{"resolution":"720P","duration":5}}}'
```

ou via le backend (recommande) :

```sh
curl -s -X POST "https://<TON_BACKEND>/api/video" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A small cat running on the grass","img_url":"https://example.com/frame.png","parameters":{"resolution":"720P","duration":5}}'
```


## Backblaze B2 (stockage gratuit — 10GB)
1. Crée un compte Backblaze et va dans **B2 Cloud Storage** → **Buckets** → **Create a Bucket**.
2. Crée une **Application Key** (B2 → App Keys → Add a New Application Key) :
   - Donne un nom, limite les permissions au minimum (readFiles, writeFiles si besoin).
   - Choisis le bucket à restreindre si possible.
   - Copie **KeyID** et **Application Key** (à stocker comme secrets).
3. Endpoint S3-compatible : `https://s3.<region>.backblazeb2.com` (ex : `https://s3.us-west-002.backblazeb2.com`).
4. Variables d’environnement à ajouter :
   - `B2_KEY` (KeyID) — Secret
   - `B2_SECRET` (Application Key) — Secret
   - `B2_ENDPOINT` (ex : `https://s3.us-west-002.backblazeb2.com`)
   - `B2_BUCKET` (nom du bucket)
5. Exemple minimal (upload Node.js — AWS SDK v3 compatible S3) :

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: "us-west-002",
  credentials: {
    accessKeyId: process.env.B2_KEY,
    secretAccessKey: process.env.B2_SECRET
  },
  forcePathStyle: true
});

await s3.send(new PutObjectCommand({
  Bucket: process.env.B2_BUCKET,
  Key: "path/to/file.png",
  Body: fileStream,
  ContentType: "image/png"
}));
```

6. Générer une URL signée (ex : `PUT` presigned) :
```js
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const cmd = new PutObjectCommand({ Bucket: process.env.B2_BUCKET, Key: "file.png" });
const url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
```

7. Tests & bonnes pratiques :
   - Garde `B2_KEY` et `B2_SECRET` secrets dans Render (backend). NE PAS envoyer ces clés au frontend.
   - Exemple d'endpoint backend pour fournir des URLs signées (PUT) : `POST /api/upload/presign` avec `{ filename, contentType?, expiresIn? }` qui renvoie `{ url, key, bucket }`.
   - Teste avec de petits fichiers puis monte les quotas si besoin.
   - B2 offre 10GB gratuits — parfait pour démarrer.



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
