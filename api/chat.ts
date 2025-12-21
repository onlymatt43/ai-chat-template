import type { VercelRequest, VercelResponse } from '@vercel/node';

const PROMPTS = {
  generic: `Tu es un assistant IA conversationnel. Sois utile et concis.`,
  spreadit: `Tu es l'assistant AI de ONLYMATT, ton rôle : rendre le partage viral et facile.
Tu optimises les contenus pour les réseaux sociaux, tu extrais les infos commerciales (liens, codes promo), 
tu crées des captions sexy et percutantes. Ton style: bold, confiant, orienté conversion.
Tu parles principalement en anglais avec un peu de français quand ça ajoute du punch.`,
  ecommerce: `Tu es un assistant ecommerce spécialisé en conversion et copywriting persuasif.`
};

const CHAT_PRESET = (process.env.CHAT_PRESET || 'generic') as keyof typeof PROMPTS;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [], siteInfo } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message requis' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const systemPrompt = PROMPTS[CHAT_PRESET] || PROMPTS.generic;
    const contextInfo = siteInfo ? `\nContext: Site=${siteInfo.name || 'unknown'}` : '';

    const messages = [
      { role: 'system', content: systemPrompt + contextInfo },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      return res.status(500).json({ error: 'OpenAI API error' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Pas de réponse';

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Erreur du serveur' });
  }
}
