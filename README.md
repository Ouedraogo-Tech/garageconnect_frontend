# GarageConnect — Frontend (React)

Interface utilisateur de GarageConnect, une application de gestion de garage automobile. Application monopage (SPA) consommant l'API Laravel sécurisée par rôle (Administrateur / Technicien).

Ce dépôt contient le front-end du projet. Le back-end Laravel se trouve dans un dépôt séparé : [garageConnect_Backend](https://github.com/Ouedraogo-Tech/garageConnect_Backend)

## Technologies utilisées

- React (via Vite)
- React Router (react-router-dom)
- Bootstrap 5

## Fonctionnalités principales

- Connexion avec gestion de rôle (Administrateur / Technicien)
- Gestion des véhicules, techniciens et réparations (liste avec recherche, détail, création, modification, suppression)
- Affichage adapté au rôle connecté (actions masquées ou visibles selon les droits)
- Gestion des comptes utilisateurs (administrateur uniquement)

## Installation

1. Cloner ce dépôt
2. Installer les dépendances : `npm install`
3. Démarrer le serveur de développement : `npm run dev`
4. Ouvrir le lien affiché dans le terminal (généralement `http://localhost:5173`)

⚠️ Ce front-end nécessite que l'API back-end (voir dépôt lié ci-dessus) soit démarrée sur `http://127.0.0.1:8000` pour fonctionner.

## Comptes de test

| Rôle | Email | Mot de passe |

| Administrateur | admin@garage.test | password123 |
| Technicien | technicien@garage.test | password123 |

## Tests

3 scénarios Selenium IDE : connexion administrateur, restriction technicien, création d'un véhicule de bout en bout.