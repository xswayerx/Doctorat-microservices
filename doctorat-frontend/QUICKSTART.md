# Guide de démarrage rapide

## Installation et démarrage

### 1. Installer les dépendances
```bash
cd doctorat-frontend
npm install
```

### 2. Démarrer les microservices Spring Boot

Assurez-vous que tous les services sont démarrés dans l'ordre suivant:

1. **Config Server** (port 8888)
2. **Eureka Server** (port 8762)
3. **User Service** (port 8081)
4. **Inscription Service** (port 8082)
5. **Gateway Service** (port 8080)

### 3. Démarrer l'application Angular
```bash
npm start
```

L'application sera accessible sur **http://localhost:4200**

## Utilisation

### Navigation
- **Tableau de bord**: Vue d'ensemble avec statistiques
- **Utilisateurs**: Gestion des utilisateurs (création, modification, consultation)
- **Inscriptions**: Gestion des inscriptions (création, modification, validation)

### Fonctionnalités principales

#### Gestion des utilisateurs
1. Cliquez sur "Utilisateurs" dans le menu
2. Utilisez le filtre pour rechercher par rôle
3. Cliquez sur l'icône "œil" pour voir le profil
4. Cliquez sur l'icône "crayon" pour modifier
5. Cliquez sur "Nouvel utilisateur" pour créer

#### Gestion des inscriptions
1. Cliquez sur "Inscriptions" dans le menu
2. Utilisez le filtre pour rechercher par statut
3. Cliquez sur l'icône "œil" pour voir les détails
4. Dans les détails, cliquez sur "Valider" pour valider une inscription
5. Cliquez sur "Nouvelle inscription" pour créer

## Rôles utilisateurs

- **CANDIDAT**: Candidat à une thèse
- **DOCTORANT**: Doctorant en cours
- **DIRECTEUR_THESE**: Directeur de thèse
- **PERSONNEL_ADMIN**: Personnel administratif

## Statuts des inscriptions

- **BROUILLON**: Inscription en cours de création
- **SOUMISE**: Inscription soumise
- **EN_ATTENTE_DIRECTEUR**: En attente de validation par le directeur
- **APPROUVEE_DIRECTEUR**: Approuvée par le directeur
- **EN_ATTENTE_ADMIN**: En attente de validation administrative
- **VALIDEE**: Inscription validée
- **REJETEE**: Inscription rejetée

## Dépannage

### L'application ne se connecte pas aux services
- Vérifiez que le gateway service est démarré (port 8080)
- Vérifiez que tous les microservices sont enregistrés dans Eureka
- Consultez les logs du gateway pour les erreurs

### Erreurs CORS
- Configurez CORS dans le gateway service (voir SETUP.md)
- Ou utilisez le proxy Angular (déjà configuré dans proxy.conf.json)

### Erreurs 404
- Vérifiez que les routes sont correctement configurées dans le gateway
- Vérifiez les noms des services dans Eureka

