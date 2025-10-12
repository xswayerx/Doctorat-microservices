

# Stop all microservices started by run-all.sh

services=("user-service" "inscription-service" "gateway-service")

for service in "${services[@]}"; do
    pid=$(pgrep -f "$service")
    
    if [ -n "$pid" ]; then
        echo "Stopping $service with PID $pid"
        kill "$pid"
    else
        echo "$service is not running"
    fi
done

echo "All specified microservices have been stopped."