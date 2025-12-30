# Doctorat Frontend - Angular Application

Application Angular frontend pour la gestion des doctorats, connectée aux microservices Spring Boot.

## Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

## Installation

1. Installer les dépendances:
```bash
npm install
```

## Configuration

L'application est configurée pour se connecter au gateway service sur `http://localhost:8080`.

Pour modifier l'URL de l'API, éditez le fichier `src/app/services/api-config.service.ts`.

## Démarrage

Démarrer l'application en mode développement:
```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`.

## Build

Pour créer une version de production:
```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/doctorat-frontend`.

## Structure du projet

```
src/
├── app/
│   ├── models/          # Modèles TypeScript (interfaces)
│   ├── services/        # Services Angular pour les appels API
│   ├── users/           # Composants de gestion des utilisateurs
│   ├── inscriptions/    # Composants de gestion des inscriptions
│   ├── dashboard/       # Composant du tableau de bord
│   └── shared/          # Composants partagés
├── assets/              # Ressources statiques
└── styles.scss          # Styles globaux
```

## Fonctionnalités

### Gestion des utilisateurs
- Liste des utilisateurs avec filtrage par rôle
- Création d'utilisateur
- Modification d'utilisateur
- Visualisation du profil avec statistiques
- Gestion des statuts (Actif, Inactif, Suspendu)

### Gestion des inscriptions
- Liste des inscriptions avec filtrage par statut
- Création d'inscription (initiale ou réinscription)
- Modification d'inscription
- Détails d'inscription
- Validation par directeur ou admin
- Workflow de validation

### Tableau de bord
- Statistiques globales
- Accès rapide aux fonctionnalités principales

## Technologies utilisées

- Angular 17
- Angular Material
- RxJS
- TypeScript

## Endpoints API

L'application utilise les endpoints suivants via le gateway (port 8080):

### Users
- `GET /users` - Liste tous les utilisateurs
- `GET /users/{id}` - Détails d'un utilisateur
- `POST /users` - Créer un utilisateur
- `PUT /users/{id}` - Modifier un utilisateur
- `PUT /users/{id}/status` - Modifier le statut
- `GET /users/doctorants` - Liste des doctorants
- `GET /users/directeurs` - Liste des directeurs
- `GET /users/{id}/profile` - Profil avec statistiques

### Inscriptions
- `GET /inscriptions` - Liste toutes les inscriptions
- `GET /inscriptions/{id}` - Détails d'une inscription
- `POST /inscriptions` - Créer une inscription
- `PUT /inscriptions/{id}` - Modifier une inscription
- `DELETE /inscriptions/{id}` - Supprimer une inscription
- `PUT /inscriptions/{id}/validate/directeur` - Valider par directeur
- `PUT /inscriptions/{id}/validate/admin` - Valider par admin
- `GET /inscriptions/doctorant/{id}` - Inscriptions d'un doctorant
- `GET /inscriptions/status/{status}` - Inscriptions par statut

## Notes

Assurez-vous que les microservices Spring Boot sont démarrés et que le gateway service est accessible avant de démarrer l'application frontend.

