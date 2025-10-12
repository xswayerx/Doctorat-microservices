# Doctorat Microservices Runner

This project provides scripts to run and manage multiple microservices simultaneously. It includes two main scripts: `run-all.sh` to start the microservices and `stop-all.sh` to stop them.

## Prerequisites

Before running the scripts, ensure you have the following installed:

- Java (JDK 11 or higher)
- Maven
- Git (optional, for cloning repositories)

## Running the Microservices

To start all microservices, navigate to the `scripts` directory and execute the following command:

```bash
./run-all.sh
```

This script will launch the following microservices in the background:

- User Service
- Inscription Service
- Gateway Service

Each service will run concurrently, allowing you to interact with them as needed.

## Stopping the Microservices

To stop all running microservices, use the following command:

```bash
./stop-all.sh
```

This script will identify and terminate all processes started by `run-all.sh`.

## Notes

- Ensure that the microservices are properly configured and their dependencies are resolved before running the scripts.
- You may need to adjust the script paths if your directory structure differs.