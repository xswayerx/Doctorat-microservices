# Configuration CORS du Gateway

## Modifications apportées

### 1. Configuration dans `application.yaml`

Ajout de la configuration CORS globale et des routes:

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: 
              - "http://localhost:4200"
              - "http://127.0.0.1:4200"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - PATCH
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true
            maxAge: 3600
      
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/users/**
          filters:
            - StripPrefix=0
        
        - id: inscription-service
          uri: lb://inscription-service
          predicates:
            - Path=/inscriptions/**
          filters:
            - StripPrefix=0
```

### 2. Classe de configuration Java

Création de `CorsConfig.java` pour une configuration CORS supplémentaire via un filtre réactif.

### 3. Activation de la découverte de services

Ajout de `@EnableDiscoveryClient` dans `GatewayServiceApplication.java` pour permettre la découverte des services via Eureka.

## Routes configurées

- `/users/**` → Route vers `user-service` via Eureka (load balancing)
- `/inscriptions/**` → Route vers `inscription-service` via Eureka (load balancing)

## Vérification

Pour vérifier que tout fonctionne:

1. Démarrer tous les microservices:
   - Config Server (port 8888)
   - Eureka Server (port 8762)
   - User Service (port 8081)
   - Inscription Service (port 8082)
   - Gateway Service (port 8080)

2. Vérifier Eureka: http://localhost:8762
   - Les services doivent être enregistrés

3. Tester le gateway:
   - http://localhost:8080/users
   - http://localhost:8080/inscriptions

4. Démarrer le frontend Angular:
   - http://localhost:4200

## Notes

- Le gateway utilise le load balancing (`lb://`) pour distribuer les requêtes
- CORS est configuré pour accepter les requêtes depuis `localhost:4200`
- Les routes utilisent `StripPrefix=0` pour conserver le chemin complet

