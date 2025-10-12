#!/bin/bash

cd /home/swayer/Documents/doctorat-microservices/user-service
./mvnw spring-boot:run &

cd /home/swayer/Documents/doctorat-microservices/inscription-service
./mvnw spring-boot:run &

cd /home/swayer/Documents/doctorat-microservices/gateway-service
./mvnw spring-boot:run &

wait

echo "All microservices are running."