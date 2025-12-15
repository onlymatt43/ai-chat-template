import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ═══════════════════════════════════════════════════════════════
// 🎯 PERSONNALISE CE PROMPT SELON TON PROJET
// ═══════════════════════════════════════════════════════════════
const SYSTEM_PROMPT = `Tu es l'assistant AI de [NOM DU SITE].

TON RÔLE:
- Aider les utilisateurs à comprendre le site
- Répondre aux questions fréquentes
- Être amical et professionnel

INFORMATIONS DU SITE:
- [Ajoute ici les infos importantes sur ton site]
- [Fonctionnalités, prix, etc.]

RÈGLES:
- Réponds dans la langue de l'utilisateur
- Sois concis (2-4 phrases)
- Si tu ne sais pas, dis-le honnêtement`;

// ═══════════════════════════════════════════════════════════════

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatService = {
  async chat(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-10), // Garde les 10 derniers messages
        { role: 'user', content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',      // Modèle rapide et économique
        messages: messages as any,
        max_tokens: 500,           // Limite la longueur de réponse
        temperature: 0.7           // Créativité (0 = strict, 1 = créatif)
      });

      return response.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error("Erreur de l'assistant AI. Réessaie dans un moment.");
    }
  }
};
