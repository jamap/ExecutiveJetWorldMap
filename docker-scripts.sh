#!/bin/bash

# Executive Aviation Route Planner - Docker Scripts
# Utility scripts for building, running and managing Docker containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project variables
PROJECT_NAME="executive-aviation-planner"
IMAGE_NAME="aviation-planner"
CONTAINER_NAME="aviation-planner-container"
PORT=8080

# Helper functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Build functions
build_python() {
    log_info "Building Python HTTP server Docker image..."
    docker build -t ${IMAGE_NAME}:python -f Dockerfile.python .
    log_success "Python image built: ${IMAGE_NAME}:python"
}

build_ultra() {
    log_info "Building ultra simple Docker image..."
    docker build -t ${IMAGE_NAME}:ultra -f Dockerfile.ultra .
    log_success "Ultra image built: ${IMAGE_NAME}:ultra"
}

build_minimal() {
    log_info "Building minimal Docker image..."
    docker build -t ${IMAGE_NAME}:minimal -f Dockerfile.minimal .
    log_success "Minimal image built: ${IMAGE_NAME}:minimal"
}

build_simple() {
    log_info "Building simple Docker image..."
    docker build -t ${IMAGE_NAME}:simple -f Dockerfile.simple .
    log_success "Simple image built: ${IMAGE_NAME}:simple"
}

build_dev() {
    log_info "Building development Docker image..."
    docker build -t ${IMAGE_NAME}:dev -f Dockerfile .
    log_success "Development image built: ${IMAGE_NAME}:dev"
}

build_prod() {
    log_info "Building production Docker image..."
    docker build -t ${IMAGE_NAME}:prod -f Dockerfile.prod .
    log_success "Production image built: ${IMAGE_NAME}:prod"
}

build_all() {
    log_info "Building all Docker images..."
    build_minimal
    build_simple
    build_dev
    build_prod
    docker images | grep ${IMAGE_NAME}
}

# Run functions
run_python() {
    log_info "Running Python HTTP server container..."
    docker run -d \
        --name ${CONTAINER_NAME}-python \
        -p ${PORT}:8080 \
        --restart unless-stopped \
        ${IMAGE_NAME}:python
    
    log_success "Python container started"
    log_info "Access at: http://localhost:${PORT}"
    show_logs_python
}

run_ultra() {
    log_info "Running ultra simple container..."
    docker run -d \
        --name ${CONTAINER_NAME}-ultra \
        -p ${PORT}:80 \
        --restart unless-stopped \
        ${IMAGE_NAME}:ultra
    
    log_success "Ultra container started"
    log_info "Access at: http://localhost:${PORT}"
    show_logs_ultra
}

run_minimal() {
    log_info "Running minimal container..."
    docker run -d \
        --name ${CONTAINER_NAME}-minimal \
        -p ${PORT}:80 \
        --restart unless-stopped \
        ${IMAGE_NAME}:minimal
    
    log_success "Minimal container started"
    log_info "Access at: http://localhost:${PORT}"
    show_logs_minimal
}

run_simple() {
    log_info "Running simple container..."
    docker run -d \
        --name ${CONTAINER_NAME}-simple \
        -p ${PORT}:80 \
        --restart unless-stopped \
        ${IMAGE_NAME}:simple
    
    log_success "Simple container started"
    log_info "Access at: http://localhost:${PORT}"
    show_logs_simple
}

run_dev() {
    log_info "Running development container..."
    docker run -d \
        --name ${CONTAINER_NAME}-dev \
        -p ${PORT}:80 \
        --restart unless-stopped \
        ${IMAGE_NAME}:dev
    
    log_success "Development container started"
    log_info "Access at: http://localhost:${PORT}"
    show_logs_dev
}

run_prod() {
    log_info "Running production container..."
    docker run -d \
        --name ${CONTAINER_NAME}-prod \
        -p ${PORT}:80 \
        --restart unless-stopped \
        --memory="128m" \
        --cpus="0.5" \
        ${IMAGE_NAME}:prod
    
    log_success "Production container started"
    log_info "Access at: http://localhost:${PORT}"
    show_logs_prod
}

# Docker Compose functions
compose_up() {
    log_info "Starting with Docker Compose..."
    docker-compose up -d
    log_success "Docker Compose services started"
    docker-compose ps
    log_info "Access at: http://localhost:8080"
}

compose_down() {
    log_info "Stopping Docker Compose services..."
    docker-compose down
    log_success "Docker Compose services stopped"
}

compose_logs() {
    docker-compose logs -f aviation-planner
}

# Management functions
stop_all() {
    log_info "Stopping all aviation planner containers..."
    docker stop ${CONTAINER_NAME}-simple ${CONTAINER_NAME}-dev ${CONTAINER_NAME}-prod 2>/dev/null || true
    docker-compose down 2>/dev/null || true
    log_success "All containers stopped"
}

clean_all() {
    log_warning "Cleaning all aviation planner containers and images..."
    read -p "Are you sure? This will remove containers and images (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Stop containers
        docker stop ${CONTAINER_NAME}-dev ${CONTAINER_NAME}-prod 2>/dev/null || true
        docker-compose down 2>/dev/null || true
        
        # Remove containers
        docker rm ${CONTAINER_NAME}-dev ${CONTAINER_NAME}-prod 2>/dev/null || true
        
        # Remove images
        docker rmi ${IMAGE_NAME}:dev ${IMAGE_NAME}:prod 2>/dev/null || true
        
        # Clean unused images
        docker image prune -f
        
        log_success "Cleanup completed"
    else
        log_info "Cleanup cancelled"
    fi
}

# Logs functions
show_logs_python() {
    log_info "Showing Python container logs..."
    docker logs -f ${CONTAINER_NAME}-python
}

show_logs_ultra() {
    log_info "Showing ultra container logs..."
    docker logs -f ${CONTAINER_NAME}-ultra
}

show_logs_minimal() {
    log_info "Showing minimal container logs..."
    docker logs -f ${CONTAINER_NAME}-minimal
}

show_logs_simple() {
    log_info "Showing simple container logs..."
    docker logs -f ${CONTAINER_NAME}-simple
}

show_logs_dev() {
    log_info "Showing development container logs..."
    docker logs -f ${CONTAINER_NAME}-dev
}

show_logs_prod() {
    log_info "Showing production container logs..."
    docker logs -f ${CONTAINER_NAME}-prod
}

# Health check
health_check() {
    log_info "Checking container health..."
    
    # Check if container is running
    if docker ps | grep -q ${CONTAINER_NAME}; then
        log_success "Container is running"
        
        # Check HTTP response
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT} | grep -q "200"; then
            log_success "Application is responding (HTTP 200)"
            log_info "✈️  Executive Aviation Route Planner is healthy!"
        else
            log_error "Application is not responding correctly"
        fi
    else
        log_error "No aviation planner container is running"
    fi
}

# Development tools
shell_dev() {
    log_info "Opening shell in development container..."
    docker exec -it ${CONTAINER_NAME}-dev /bin/sh
}

shell_prod() {
    log_info "Opening shell in production container..."
    docker exec -it ${CONTAINER_NAME}-prod /bin/sh
}

# Performance monitoring
stats() {
    log_info "Container resource usage:"
    docker stats ${CONTAINER_NAME}-dev ${CONTAINER_NAME}-prod --no-stream 2>/dev/null || \
    docker stats --no-stream | grep aviation
}

# Help function
show_help() {
    echo "🛩️  Executive Aviation Route Planner - Docker Scripts"
    echo
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Build Commands:"
    echo "  build-python    Build Python HTTP server (guaranteed to work)"
    echo "  build-ultra     Build ultra simple Apache (fixed)"
    echo "  build-minimal   Build minimal Apache (basic logs)"
    echo "  build-simple    Build simple Apache (basic features)"
    echo "  build-dev       Build development Apache"
    echo "  build-prod      Build production Apache"
    echo "  build-all       Build all images"
    echo
    echo "Run Commands:"
    echo "  run-python      Run Python container (most reliable)"
    echo "  run-ultra       Run ultra Apache container"
    echo "  run-minimal     Run minimal Apache container"
    echo "  run-simple      Run simple Apache container"
    echo "  run-dev         Run development Apache container"
    echo "  run-prod        Run production Apache container"
    echo "  compose-up      Start with Docker Compose"
    echo "  compose-down    Stop Docker Compose"
    echo "  compose-logs    Show Docker Compose logs"
    echo
    echo "Management Commands:"
    echo "  stop-all        Stop all containers"
    echo "  clean-all       Clean containers and images"
    echo "  health          Check application health"
    echo "  stats           Show resource usage"
    echo
    echo "Development Commands:"
    echo "  logs-minimal    Show minimal container logs"
    echo "  logs-simple     Show simple container logs"
    echo "  logs-dev        Show development logs"
    echo "  logs-prod       Show production logs"
    echo "  shell-dev       Open shell in dev container"
    echo "  shell-prod      Open shell in prod container"
    echo
    echo "Examples:"
    echo "  $0 build-python && $0 run-python    # Python server (guaranteed)"
    echo "  $0 build-ultra && $0 run-ultra      # Ultra Apache (fixed)"
    echo "  $0 compose-up                       # Docker Compose"
    echo "  $0 health                           # Check status"
}

# Main script
main() {
    case "${1:-help}" in
        build-python)   build_python ;;
        build-ultra)    build_ultra ;;
        build-minimal)  build_minimal ;;
        build-simple)   build_simple ;;
        build-dev)      build_dev ;;
        build-prod)     build_prod ;;
        build-all)      build_all ;;
        run-python)     run_python ;;
        run-ultra)      run_ultra ;;
        run-minimal)    run_minimal ;;
        run-simple)     run_simple ;;
        run-dev)        run_dev ;;
        run-prod)       run_prod ;;
        compose-up)     compose_up ;;
        compose-down)   compose_down ;;
        compose-logs)   compose_logs ;;
        stop-all)       stop_all ;;
        clean-all)      clean_all ;;
        logs-python)    show_logs_python ;;
        logs-ultra)     show_logs_ultra ;;
        logs-minimal)   show_logs_minimal ;;
        logs-simple)    show_logs_simple ;;
        logs-dev)       show_logs_dev ;;
        logs-prod)      show_logs_prod ;;
        shell-dev)      shell_dev ;;
        shell-prod)     shell_prod ;;
        health)         health_check ;;
        stats)          stats ;;
        help|*)         show_help ;;
    esac
}

# Run main function
main "$@"