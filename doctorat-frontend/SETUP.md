# Guide de configuration du Gateway

## Configuration des routes du Gateway

Le gateway service utilise Spring Cloud Gateway avec Eureka pour la découverte de services. Les routes sont automatiquement configurées via la découverte de services Eureka.

### Routes attendues

Le gateway devrait router les requêtes comme suit:
- `/users/**` → `user-service` (port 8081)
- `/inscriptions/**` → `inscription-service` (port 8082)

### Configuration CORS (si nécessaire)

Si vous rencontrez des erreurs CORS, vous devrez ajouter une configuration CORS dans le gateway service. Créez un fichier de configuration ou ajoutez dans `application.yaml`:

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "http://localhost:4200"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true
```

### Vérification

1. Assurez-vous que tous les services sont démarrés:
   - Eureka Server (port 8762)
   - Config Server (port 8888)
   - User Service (port 8081)
   - Inscription Service (port 8082)
   - Gateway Service (port 8080)

2. Vérifiez que les services sont enregistrés dans Eureka:
   - Accédez à http://localhost:8762

3. Testez les endpoints via le gateway:
   - http://localhost:8080/users
   - http://localhost:8080/inscriptions

## Démarrage de l'application frontend

1. Installer les dépendances:
```bash
cd doctorat-frontend
npm install
```

2. Démarrer l'application:
```bash
npm start
```

3. L'application sera accessible sur http://localhost:4200

## Dépannage

### Erreur CORS
Si vous voyez des erreurs CORS dans la console du navigateur, configurez CORS dans le gateway service comme indiqué ci-dessus.

### Services non accessibles
- Vérifiez que tous les microservices sont démarrés
- Vérifiez que le gateway peut accéder à Eureka
- Vérifiez les logs du gateway pour les erreurs de routage

### Erreurs 404
- Vérifiez que les routes sont correctement configurées dans le gateway
- Vérifiez que les services sont enregistrés dans Eureka avec les bons noms:
  - `user-service`
  - `inscription-service`

