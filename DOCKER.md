# 🐳 Executive Aviation Route Planner - Docker Guide

Complete Docker setup with **Alpine Linux + Apache** for optimal performance and security.

## 📋 **Overview**

- **Base Image**: Alpine Linux 3.18 (minimal footprint)
- **Web Server**: Apache HTTPd (production-ready)
- **Image Size**: ~15MB (compressed)
- **Security**: Hardened configuration with non-root user
- **Performance**: Optimized for static content delivery

---

## 🚀 **Quick Start**

### **Option 1: Docker Compose (Recommended)**
```bash
# Start the application
docker-compose up -d

# Access at: http://localhost:8080
open http://localhost:8080

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### **Option 2: Docker Build & Run**
```bash
# Build image
docker build -t aviation-planner .

# Run container
docker run -d -p 8080:80 --name aviation-planner aviation-planner

# Access at: http://localhost:8080
```

### **Option 3: Using Helper Scripts**
```bash
# Make executable
chmod +x docker-scripts.sh

# Quick start
./docker-scripts.sh build-dev
./docker-scripts.sh run-dev

# Or use Docker Compose
./docker-scripts.sh compose-up
```

---

## 📁 **Docker Files Structure**

```
worldmaphtml/
├── Dockerfile              # Development build
├── Dockerfile.prod         # Production build (hardened)
├── docker-compose.yml      # Compose configuration
├── .dockerignore           # Ignore patterns
├── docker-scripts.sh       # Utility scripts
└── DOCKER.md              # This documentation
```

---

## 🏗️ **Build Options**

### **Development Build**
```bash
docker build -t aviation-planner:dev .
```
- Basic Apache configuration
- Includes development tools
- Suitable for testing

### **Production Build**
```bash
docker build -t aviation-planner:prod -f Dockerfile.prod .
```
- Security hardened
- Performance optimized
- Non-root user
- Security headers
- Resource limits

### **Multi-Architecture** (Future)
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t aviation-planner:latest .
```

---

## 🚀 **Deployment Options**

### **1. Local Development**
```bash
docker run -d \
  --name aviation-dev \
  -p 8080:80 \
  aviation-planner:dev
```

### **2. Production Deployment**
```bash
docker run -d \
  --name aviation-prod \
  -p 80:80 \
  --restart unless-stopped \
  --memory="128m" \
  --cpus="0.5" \
  aviation-planner:prod
```

### **3. Docker Compose Production**
```yaml
version: '3.8'
services:
  aviation-planner:
    image: aviation-planner:prod
    ports:
      - "80:80"
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.5'
```

---

## 🛠️ **Configuration**

### **Environment Variables**
```bash
# Timezone (optional)
TZ=UTC

# Apache configuration (advanced)
APACHE_LOG_LEVEL=warn
```

### **Volumes** (Optional)
```bash
# Custom logs directory
-v ./logs:/var/log/apache2

# Custom content (if needed)
-v ./custom-content:/var/www/html
```

### **Network Configuration**
```bash
# Custom network
docker network create aviation-network
docker run --network aviation-network aviation-planner
```

---

## 📊 **Performance & Monitoring**

### **Resource Usage**
```bash
# Check resource consumption
docker stats aviation-planner

# Container info
docker inspect aviation-planner
```

### **Health Checks**
```bash
# Manual health check
curl -f http://localhost:8080 || echo "Application down"

# Docker health status
docker ps --filter "name=aviation-planner"
```

### **Logs**
```bash
# Follow logs
docker logs -f aviation-planner

# Last 100 lines
docker logs --tail 100 aviation-planner

# With timestamps
docker logs -t aviation-planner
```

---

## 🔒 **Security Features**

### **Production Hardening**
- **Non-root user**: Runs as `aviation` user (UID 1001)
- **Security headers**: XSS, CSRF, Content-Type protection
- **Server tokens**: Hidden Apache version
- **File permissions**: Restricted access to sensitive files
- **Content Security Policy**: Prevents XSS attacks

### **Network Security**
```bash
# Restrict to localhost only
docker run -p 127.0.0.1:8080:80 aviation-planner

# Custom firewall rules (iptables example)
iptables -A INPUT -p tcp --dport 8080 -s 192.168.1.0/24 -j ACCEPT
```

---

## 🚀 **Scaling & Load Balancing**

### **Multiple Instances**
```bash
# Scale with Docker Compose
docker-compose up --scale aviation-planner=3

# Manual scaling
for i in {1..3}; do
  docker run -d --name aviation-$i -p 808$i:80 aviation-planner
done
```

### **Load Balancer (Nginx)**
```nginx
upstream aviation {
    server localhost:8081;
    server localhost:8082;
    server localhost:8083;
}

server {
    listen 80;
    location / {
        proxy_pass http://aviation;
    }
}
```

---

## 🧪 **Testing**

### **Container Testing**
```bash
# Test build
docker build -t aviation-test .

# Test run
docker run --rm -p 8080:80 aviation-test &
sleep 5

# Test HTTP response
curl -f http://localhost:8080 && echo "✅ OK" || echo "❌ FAIL"

# Test health endpoint
curl -f http://localhost:8080/health 2>/dev/null || echo "No health endpoint"

# Cleanup
docker stop aviation-test
```

### **Automated Testing**
```bash
# Integration test script
#!/bin/bash
set -e

echo "🧪 Testing Aviation Planner Docker..."

# Build
docker build -t aviation-test .

# Run
CONTAINER_ID=$(docker run -d -p 8080:80 aviation-test)

# Wait for startup
sleep 10

# Test
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Test passed"
else
    echo "❌ Test failed - HTTP $HTTP_CODE"
fi

# Cleanup
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID
```

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Find process using port
lsof -i :8080
# or
netstat -tulpn | grep 8080

# Kill process
kill -9 <PID>
```

#### **Container Won't Start**
```bash
# Check logs
docker logs aviation-planner

# Check events
docker events --filter container=aviation-planner

# Debug with shell
docker run -it --rm aviation-planner /bin/sh
```

#### **Health Check Failing**
```bash
# Manual test inside container
docker exec aviation-planner wget -O- http://localhost/

# Check Apache status
docker exec aviation-planner ps aux | grep httpd
```

#### **Permission Issues**
```bash
# Check file permissions
docker exec aviation-planner ls -la /var/www/html/

# Fix permissions (if needed)
docker exec aviation-planner chown -R apache:apache /var/www/html
```

### **Performance Issues**
```bash
# Monitor resource usage
docker stats aviation-planner

# Check Apache processes
docker exec aviation-planner apachectl status

# Review Apache configuration
docker exec aviation-planner cat /etc/apache2/httpd.conf
```

---

## 🎯 **Best Practices**

### **Development**
- Use development Dockerfile for testing
- Mount source code as volume for live reloading
- Enable detailed logging
- Use `--rm` flag for temporary containers

### **Production**
- Use production Dockerfile with security hardening
- Set resource limits (memory, CPU)
- Enable health checks
- Use restart policies
- Monitor logs and metrics
- Regular security updates

### **Image Optimization**
- Multi-stage builds for smaller images
- Use .dockerignore to exclude unnecessary files
- Layer caching optimization
- Security scanning with tools like Trivy

---

## 📈 **Monitoring & Observability**

### **Basic Monitoring**
```bash
# Container metrics
docker exec aviation-planner top

# Disk usage
docker exec aviation-planner df -h

# Network connections
docker exec aviation-planner netstat -tulpn
```

### **Advanced Monitoring** (Optional)
```yaml
# Prometheus monitoring
version: '3.8'
services:
  aviation-planner:
    # ... main service
  
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports:
      - "8081:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
```

---

## 🔗 **Integration Examples**

### **CI/CD Pipeline** (GitHub Actions)
```yaml
name: Docker Build & Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t aviation-planner .
      - name: Run tests
        run: |
          docker run -d -p 8080:80 --name test aviation-planner
          sleep 10
          curl -f http://localhost:8080
          docker stop test && docker rm test
```

### **Kubernetes Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aviation-planner
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aviation-planner
  template:
    metadata:
      labels:
        app: aviation-planner
    spec:
      containers:
      - name: aviation-planner
        image: aviation-planner:prod
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: aviation-service
spec:
  selector:
    app: aviation-planner
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

---

## 📞 **Support**

- **Docker Issues**: Check logs and troubleshooting section
- **Application Issues**: See main README.md
- **Performance**: Monitor resources and optimize configuration

---

**🛩️ Dockerized Executive Aviation Route Planner - Ready for production deployment!**