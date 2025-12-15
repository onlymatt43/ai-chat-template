#!/bin/sh
# Script de démarrage rapide pour le backend AI Chat

if [ ! -f .env ]; then
  echo "Copie de .env.example vers .env (à personnaliser)"
  cp .env.example .env
fi

echo "Installation des dépendances..."
npm install

echo "Lancement du serveur en mode développement..."
npm run dev
