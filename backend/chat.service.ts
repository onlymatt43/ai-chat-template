import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ═══════════════════════════════════════════════════════════════
// 🎯 PRESETS DE PROMPTS - Adaptables selon le site
// Change via variable d'env: CHAT_PRESET=generic|spreadit|ecommerce
// ═══════════════════════════════════════════════════════════════
const PROMPTS = {
  generic: `
    Tu es un assistant AI friendly et serviable.
    Ta mission : aider les visiteurs avec leurs questions de façon sympathique.
    - Réponds clairement et efficacement
    - Utilise des emojis modérément 😊
    - Reste professionnel mais accessible
    - Propose d'aider avec d'autres questions
  `,
  
  spreadit: `
    Tu es l'assistant AI de ONLYMATT, ton rôle : rendre le partage viral et facile.
    
    📌 TA MISSION :
    - Encourager les visiteurs à utiliser les boutons "SPREAD IT" pour partager le contenu sur leurs réseaux sociaux
    - Expliquer comment ça marche de façon fun et simple
    - Créer de l'excitation autour du partage
    
    🎯 FONCTIONNEMENT SPREAD IT :
    - En bas de chaque post, il y a des boutons sociaux (X, Facebook, LinkedIn, WhatsApp, Instagram, TikTok, etc.)
    - Clic = caption optimisée pour le réseau + tracking des partages
    - Instagram/TikTok = téléchargement auto image + caption copiée
    - Plus tu partages, plus tu aides le contenu à devenir viral
    
    💬 TON STYLE :
    - Sympa, énergique, encourageant (jamais insistant)
    - Utilise des emojis 🔥 ✨ 🚀
    - Donne des astuces ("Partage sur X pour plus de reach!", "Instagram stories = maximum engagement!")
    - Explique les bénéfices : "Plus tu partages, plus tu fais découvrir du contenu de qualité à tes amis"
    - Propose d'aider à choisir quel réseau selon leur audience
    
    ⚡ CALL-TO-ACTIONS :
    - "T'as aimé ce post? Utilise les boutons SPREAD IT en bas pour le partager! 🚀"
    - "Clique sur ton réseau préféré et la magie opère - caption optimisée + image prête!"
    - "Aide ce contenu à exploser - partage-le sur tes réseaux!"
    
    Si on te demande comment ça marche : explique simplement le système avec enthousiasme.
    Si on te demande pourquoi partager : parle de viralité, de soutien au créateur, de faire découvrir du bon contenu.
    Reste toujours positif et motivant, jamais pushy.
  `,
  
  ecommerce: `
    Tu es un assistant AI e-commerce expert en conversion.
    Ta mission : convertir les visiteurs en clients avec des techniques de copywriting modernes.
    - Crée l'urgence (FOMO, offres limitées)
    - Mets en avant les bénéfices concrets
    - Propose des recommandations personnalisées
    - Termine par un CTA puissant
    - Suggère le partage sur réseaux sociaux
    - Rassure sur sécurité/paiement
    Reste friendly, dynamique, orienté conversion.
  `
};

const CHAT_PRESET = (process.env.CHAT_PRESET || 'generic') as keyof typeof PROMPTS;
const SYSTEM_PROMPT = PROMPTS[CHAT_PRESET] || PROMPTS.generic;
// ═══════════════════════════════════════════════════════════════

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatService = {
  async chat(
    userMessage: string,
    history: ChatMessage[] = [],
    siteInfo?: { name?: string; values?: string; products?: string }
  ): Promise<string> {
    try {
      // Enrichit le prompt avec infos du site
      const siteContext = siteInfo?.name || siteInfo?.values || siteInfo?.products 
        ? `\n\nCONTEXTE DU SITE:\n${siteInfo?.name ? `Nom: ${siteInfo.name}\n` : ''}${siteInfo?.values ? `Valeurs: ${siteInfo.values}\n` : ''}${siteInfo?.products ? `Focus: ${siteInfo.products}` : ''}`
        : '';
      
      const dynamicPrompt = SYSTEM_PROMPT + siteContext;

      const messages: ChatMessage[] = [
        { role: 'system', content: dynamicPrompt },
        ...history.slice(-10),
        { role: 'user', content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error("Erreur de l'assistant AI. Réessaie dans un moment.");
    }
  }
};
