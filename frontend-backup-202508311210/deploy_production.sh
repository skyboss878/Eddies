#!/bin/bash

echo "🚀 DEPLOYING BILLION-DOLLAR AUTO REPAIR SOFTWARE TO PRODUCTION"
echo "============================================================================"

# Build frontend
echo "📦 Building React frontend..."
cd frontend
npm run build
cd ..

# Set production environment
export ENVIRONMENT=production
export DATABASE_URL="postgresql://username:password@localhost/auto_repair_prod"
export SECRET_KEY="your-super-secret-production-key"
export REDIS_URL="redis://localhost:6379/0"

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

# Run database migrations
echo "🗄️ Running database migrations..."
alembic upgrade head

# Start production services
echo "🌟 Starting production services..."

# Start Redis
redis-server --daemonize yes

# Start Celery workers
celery -A app.celery_app worker --loglevel=info --detach

# Start FastAPI with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 --daemon

# Setup Nginx (if not already configured)
if [ ! -f /etc/nginx/sites-available/auto-repair ]; then
    echo "🌐 Configuring Nginx..."
    sudo tee /etc/nginx/sites-available/auto-repair > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name your-domain.com;
    
    # Serve React build files
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # WebSocket support
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
NGINX_EOF

    sudo ln -s /etc/nginx/sites-available/auto-repair /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

echo "✅ BILLION-DOLLAR AUTO REPAIR SOFTWARE DEPLOYED SUCCESSFULLY!"
echo "🌐 Access your application at: http://your-domain.com"
echo "📊 API Documentation: http://your-domain.com/api/docs"
echo "🎯 Ready to serve billions of dollars worth of auto repair business!"
