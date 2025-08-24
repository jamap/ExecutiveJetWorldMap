# Executive Aviation Route Planner
# Alpine Linux + Apache HTTPd
# Optimized for production deployment

FROM alpine:3.18

# Metadata
LABEL maintainer="jose.armando.porto@gmail.com"
LABEL description="Executive Aviation Route Planner - Dockerized with Alpine + Apache"
LABEL version="1.0.0"

# Install Apache and required packages
RUN apk add --no-cache \
    apache2 \
    apache2-utils \
    && rm -rf /var/cache/apk/*

# Create necessary directories
RUN mkdir -p /var/www/html \
    && mkdir -p /var/log/apache2 \
    && mkdir -p /run/apache2

# Copy application files
COPY index.html /var/www/html/
COPY style.css /var/www/html/
COPY script.js /var/www/html/
COPY data.js /var/www/html/
COPY README.md /var/www/html/

# Create custom Apache configuration
RUN echo 'ServerRoot /var/www' > /etc/apache2/httpd.conf \
    && echo 'Listen 80' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule mpm_prefork_module modules/mod_mpm_prefork.so' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule authz_core_module modules/mod_authz_core.so' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule dir_module modules/mod_dir.so' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule mime_module modules/mod_mime.so' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule rewrite_module modules/mod_rewrite.so' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule headers_module modules/mod_headers.so' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule deflate_module modules/mod_deflate.so' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule expires_module modules/mod_expires.so' >> /etc/apache2/httpd.conf \
    && echo 'LoadModule setenvif_module modules/mod_setenvif.so' >> /etc/apache2/httpd.conf \
    && echo '' >> /etc/apache2/httpd.conf \
    && echo 'ServerName localhost' >> /etc/apache2/httpd.conf \
    && echo 'DocumentRoot /var/www/html' >> /etc/apache2/httpd.conf \
    && echo 'DirectoryIndex index.html' >> /etc/apache2/httpd.conf \
    && echo '' >> /etc/apache2/httpd.conf \
    && echo '<Directory /var/www/html>' >> /etc/apache2/httpd.conf \
    && echo '    AllowOverride None' >> /etc/apache2/httpd.conf \
    && echo '    Require all granted' >> /etc/apache2/httpd.conf \
    && echo '    Options -Indexes +FollowSymLinks' >> /etc/apache2/httpd.conf \
    && echo '</Directory>' >> /etc/apache2/httpd.conf \
    && echo '' >> /etc/apache2/httpd.conf \
    && echo '# MIME Types' >> /etc/apache2/httpd.conf \
    && echo 'TypesConfig /etc/apache2/mime.types' >> /etc/apache2/httpd.conf \
    && echo '' >> /etc/apache2/httpd.conf \
    && echo '# Security Headers' >> /etc/apache2/httpd.conf \
    && echo 'Header always set X-Content-Type-Options nosniff' >> /etc/apache2/httpd.conf \
    && echo 'Header always set X-Frame-Options DENY' >> /etc/apache2/httpd.conf \
    && echo 'Header always set X-XSS-Protection "1; mode=block"' >> /etc/apache2/httpd.conf \
    && echo '' >> /etc/apache2/httpd.conf \
    && echo '# Compression' >> /etc/apache2/httpd.conf \
    && echo '<Location />' >> /etc/apache2/httpd.conf \
    && echo '    SetOutputFilter DEFLATE' >> /etc/apache2/httpd.conf \
    && echo '    SetEnvIfNoCase Request_URI \\' >> /etc/apache2/httpd.conf \
    && echo '        \\.(?:gif|jpe?g|png)$ no-gzip dont-vary' >> /etc/apache2/httpd.conf \
    && echo '</Location>' >> /etc/apache2/httpd.conf \
    && echo '' >> /etc/apache2/httpd.conf \
    && echo '# Cache Control' >> /etc/apache2/httpd.conf \
    && echo '<FilesMatch "\\.(css|js|html)$">' >> /etc/apache2/httpd.conf \
    && echo '    ExpiresActive On' >> /etc/apache2/httpd.conf \
    && echo '    ExpiresDefault "access plus 1 day"' >> /etc/apache2/httpd.conf \
    && echo '</FilesMatch>' >> /etc/apache2/httpd.conf \
    && echo '' >> /etc/apache2/httpd.conf \
    && echo 'ErrorLog /var/log/apache2/error.log' >> /etc/apache2/httpd.conf \
    && echo 'CustomLog /var/log/apache2/access.log combined' >> /etc/apache2/httpd.conf

# Set proper permissions
RUN chown -R apache:apache /var/www/html \
    && chmod -R 755 /var/www/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Create startup script
RUN echo '#!/bin/sh' > /start.sh \
    && echo 'echo "🛩️  Starting Executive Aviation Route Planner..."' >> /start.sh \
    && echo 'echo "📍 Alpine Linux + Apache HTTPd"' >> /start.sh \
    && echo 'echo "🌐 Available at: http://localhost"' >> /start.sh \
    && echo 'echo "📊 Health check: http://localhost"' >> /start.sh \
    && echo 'echo ""' >> /start.sh \
    && echo '/usr/sbin/httpd -D FOREGROUND' >> /start.sh \
    && chmod +x /start.sh

# Start Apache
CMD ["/start.sh"]