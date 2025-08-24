# Use the official Apache httpd image from Docker Hub
FROM httpd:2.4-alpine

# Metadata
LABEL maintainer="jose.armando.porto@gmail.com"
LABEL description="Executive Aviation Route Planner - Simplified Docker setup"
LABEL version="2.0.0"

# Copy application files to the Apache document root
COPY ./index.html /usr/local/apache2/htdocs/
COPY ./style.css /usr/local/apache2/htdocs/
COPY ./script.js /usr/local/apache2/htdocs/
COPY ./data.js /usr/local/apache2/htdocs/
