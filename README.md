# API Pricing Delivery

Ce projet est une API de moteur de tarification pour une plateforme de livraison de repas, développée en suivant les principes du Test-Driven Development (TDD). 

[![CI Pipeline](https://img.shields.io/github/actions/workflow/status/mandarasoloson/api-tdd-practice/ci.yml?branch=main&style=flat-square)](https://github.com/TON_NOM_UTILISATEUR/TON_DEPOT/actions)
[![Coverage](https://img.shields.io/badge/coverage-97%25-brightgreen?style=flat-square)](#)
[![Node Version](https://img.shields.io/badge/node-20.x-blue?style=flat-square)](https://nodejs.org/)

## Fonctionnalités

* Calcul dynamique des frais de livraison selon la distance et le poids.
* Système de validation de codes promotionnels.
* Moteur de Surge Pricing pour les heures de pointe et le week-end.
* Simulation et enregistrement de commandes via API REST.

## Stack Technique

* Runtime : Node.js
* Framework API : Express
* Tests : Vitest & Supertest
* Qualité : ESLint & Coverage (v8)
* CI/CD : GitHub Actions

## Installation et Tests

Le projet impose un seuil de couverture de code de 80%.

```bash
# Installation
npm install

# Lancer les tests
npm test

# Rapport de couverture
npm run test:coverage

# Vérifier le code
npm run lint

## API Documentation

* POST /orders/simulate : Calcule le prix détaillé sans enregistrer.
* POST /orders : Calcule le prix et enregistre la commande (ID unique).
* GET /orders/:id : Récupère une commande enregistrée.
* POST /promo/validate : Vérifie la validité d'un code promo.

## Architecture

* src/utils.js : Fonctions utilitaires.
* src/validators.js : Validation des entrées.
* src/pricing.js : Logique métier.
* src/app.js : Routes Express.
* tests/ : Tests unitaires et d'intégration.
