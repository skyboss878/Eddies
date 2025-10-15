#!/bin/bash

# ==============================================================================
# EDDIE'S AUTOMOTIVE - COMPLETE SETUP SCRIPT
# Million Dollar Software Experience - Professional Setup
# ==============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Unicode symbols
CHECK="✅"
CROSS="❌"
ARROW="➡️"
STAR="⭐"
GEAR="⚙️"
ROCKET="🚀"
DATABASE="🗄️"
FRONTEND="💻"
BACKEND="🔧"
AI="🤖"

print_banner() {
    echo -e "${PURPLE}"
    echo "=============================================================================="
    echo "                    EDDIE'S ASKAN AUTOMOTIVE SETUP"
    echo "                   Million Dollar Software Experience"
    echo "=============================================================================="
    echo -e "${NC}"
}

print_step() {
    echo -e "${CYAN}${ARROW} $1${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if script is run from project root
check_project_structure() {
    print_step "Checking project structure..."
    
    if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Please run this script from the project root directory"
        print_info "Expected structure:"
        print_info "  eddies-automotive/"
        print_info "  ├── backend/"
        print_info "  ├── frontend/"
        print_info "  └── setup.sh (this script)"
        exit 1
    fi
    
    print_success "Project structure verified"
}

# Check system requirements
check_requirements() {
    print_step "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | sed 's/v//')
    if [ "$(echo "$NODE_VERSION 18.0.0" | tr " " "\n" | sort -V | head -n1)" != "18.0.0" ]; then
        print_warning "Node.js version $NODE_VERSION detected. Recommend Node.js 18+."
    else
        print_success "Node.js version $NODE_VERSION ✓"
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | sed 's/Python //')
    print_success "Python version $PYTHON_VERSION ✓"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm $(npm --version) ✓"
    
    # Check pip
    if ! command -v pip3 &> /dev/null; then
        print_error "pip3 is not installed. Please install pip3."
        exit 1
    fi
    
    print_success "All system requirements met"
}

# Setup backend environment
setup_backend() {
    print_step "Setting up backend environment..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        print_info "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install requirements
    print_info "Installing Python dependencies..."
    cat > requirements.txt << EOF
flask==3.0.0
flask-cors==4.0.0
flask-jwt-extended==4.6.0
python-dotenv==1.0.0
bcrypt==4.1.2
requests==2.31.0
openai==1.12.0
sqlite3
werkzeug==3.0.1
cryptography==41.0.8
gunicorn==21.2.0
EOF
    
    pip install -r requirements.txt
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_info "Creating backend .env file..."
        cat > .env << EOF
# EDDIE'S AUTOMOTIVE - BACKEND CONFIGURATION

# Environment
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=$(openssl rand -hex 32)
DATABASE_PATH=eddie_automotive.db

# JWT Configuration (Production Ready)
JWT_SECRET_KEY=$(openssl rand -hex 32)
JWT_ACCESS_TOKEN_EXPIRES=24
JWT_ALGORITHM=HS256
JWT_ISSUER=eddies-automotive
JWT_AUDIENCE=eddies-automotive-app

# AI Services (Add your API keys here)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# OpenRouter Configuration (Fallback)
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=anthropic/claude-3-haiku
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_NAME=Eddies Automotive

# CORS & Security
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
CORS_SUPPORTS_CREDENTIALS=true

# Shop Configuration
SHOP_NAME=Eddie's Askan Automotive
SHOP_ADDRESS=3123 Chester Ave, Bakersfield, CA 93301
SHOP_PHONE=(661) 327-4242
SHOP_EMAIL=info@eddiesautomotive.com
DEFAULT_LABOR_RATE=140.00
DEFAULT_TAX_RATE=0.0875

# Logging
LOG_LEVEL=INFO
LOG_FILE=eddie_automotive.log
EOF
        print_warning "Created .env file with default values"
        print_warning "Please update your API keys in backend/.env"
    fi
    
    cd ..
    print_success "Backend environment setup complete"
}

# Setup frontend environment
setup_frontend() {
    print_step "Setting up frontend environment..."
    
    cd frontend
    
    # Install dependencies
    print_info "Installing Node.js dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_info "Creating frontend .env file..."
        cat > .env << EOF
# EDDIE'S AUTOMOTIVE - FRONTEND CONFIGURATION

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Eddie's Askan Automotive
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_AI_DIAGNOSTICS=true
VITE_ENABLE_TIME_TRACKING=true
VITE_ENABLE_REPORTS=true

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info
EOF
        print_success "Created frontend .env file"
    fi
    
    cd ..
    print_success "Frontend environment setup complete"
}

# Initialize database with sample data
init_database() {
    print_step "Initializing database with sample data..."
    
    cd backend
    source venv/bin/activate
    
    # Create initialization script
    cat > init_sample_data.py << 'EOF'
#!/usr/bin/env python3
"""Initialize Eddie's Automotive with professional sample data"""

import sqlite3
import bcrypt
from datetime import datetime, timedelta
import json

def init_sample_data():
    print("🗄️ Initializing database with professional sample data...")
    
    conn = sqlite3.connect('eddie_automotive.db')
    cursor = conn.cursor()
    
    # Sample customers with realistic data
    customers_data = [
        ("John Martinez", "john.martinez@email.com", "(661) 555-0101", "1234 Oak Street, Bakersfield, CA 93301", "Bakersfield", "CA", "93301", "Regular customer, prefers early morning appointments"),
        ("Sarah Johnson", "sarah.johnson@email.com", "(661) 555-0102", "5678 Pine Avenue, Bakersfield, CA 93305", "Bakersfield", "CA", "93305", "Fleet manager for local business"),
        ("Mike Rodriguez", "mike.rodriguez@email.com", "(661) 555-0103", "9012 Elm Drive, Bakersfield, CA 93308", "Bakersfield", "CA", "93308", "Classic car enthusiast"),
        ("Lisa Chen", "lisa.chen@email.com", "(661) 555-0104", "3456 Maple Lane, Bakersfield, CA 93312", "Bakersfield", "CA", "93312", "Teacher, needs reliable transportation"),
        ("David Thompson", "david.thompson@email.com", "(661) 555-0105", "7890 Cedar Court, Bakersfield, CA 93314", "Bakersfield", "CA", "93314", "Construction worker, heavy truck use")
    ]
    
    customer_ids = []
    for customer in customers_data:
        cursor.execute('''
            INSERT OR IGNORE INTO customers (name, email, phone, address, city, state, zip_code, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', customer)
        customer_ids.append(cursor.lastrowid)
    
    print(f"✅ Added {len(customers_data)} sample customers")
    
    # Sample vehicles
    vehicles_data = [
        (customer_ids[0], 2018, "Honda", "Civic", "1.5L 4-Cyl", "1HGBH41JXMN109186", "ABC123", "Silver", 45000, "CVT", "Gasoline"),
        (customer_ids[0], 2020, "Toyota", "Camry", "2.5L 4-Cyl", "4T1B11HK5LU123456", "DEF456", "White", 32000, "Automatic", "Gasoline"),
        (customer_ids[1], 2019, "Ford", "F-150", "5.0L V8", "1FTFW1ET5KFA12345", "GHI789", "Blue", 58000, "Automatic", "Gasoline"),
        (customer_ids[2], 1967, "Chevrolet", "Camaro", "5.7L V8", "123377N100001", "JKL012", "Red", 85000, "Manual", "Gasoline"),
        (customer_ids[3], 2021, "Nissan", "Sentra", "2.0L 4-Cyl", "3N1AB8CV8MY123456", "MNO345", "Black", 28000, "CVT", "Gasoline"),
        (customer_ids[4], 2017, "Chevrolet", "Silverado", "6.2L V8", "1GCUKREC9HZ123456", "PQR678", "Gray", 75000, "Automatic", "Gasoline")
    ]
    
    vehicle_ids = []
    for vehicle in vehicles_data:
        cursor.execute('''
            INSERT OR IGNORE INTO vehicles (customer_id, year, make, model, engine, vin, license_plate, color, mileage, transmission, fuel_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', vehicle)
        vehicle_ids.append(cursor.lastrowid)
    
    print(f"✅ Added {len(vehicles_data)} sample vehicles")
    
    # Sample jobs
    jobs_data = [
        (customer_ids[0], vehicle_ids[0], "Oil Change Service", "Regular maintenance oil change with filter replacement", "completed", "normal", 95.00, 35.00, 130.00, 1, None, (datetime.now() - timedelta(days=2)).isoformat()),
        (customer_ids[1], vehicle_ids[2], "Brake Pad Replacement", "Replace front brake pads and resurface rotors", "in_progress", "high", 280.00, 180.00, 460.00, 1, None, None),
        (customer_ids[2], vehicle_ids[3], "Engine Tune-up", "Classic car engine tune-up with carburetor adjustment", "pending", "normal", 420.00, 125.00, 545.00, 1, (datetime.now() + timedelta(days=3)).isoformat(), None),
        (customer_ids[3], vehicle_ids[4], "Transmission Service", "CVT transmission fluid change", "scheduled", "normal", 140.00, 85.00, 225.00, 1, (datetime.now() + timedelta(days=1)).isoformat(), None),
        (customer_ids[4], vehicle_ids[5], "Diagnostic Check", "Check engine light diagnostic", "in_progress", "medium", 150.00, 0.00, 150.00, 1, None, None)
    ]
    
    for job in jobs_data:
        cursor.execute('''
            INSERT OR IGNORE INTO jobs (customer_id, vehicle_id, title, description, status, priority, labor_cost, parts_cost, total_cost, technician_id, scheduled_date, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', job)
    
    print(f"✅ Added {len(jobs_data)} sample jobs")
    
    # Sample estimates
    estimates_data = [
        (customer_ids[1], vehicle_ids[2], "Transmission Repair", "Transmission rebuild estimate", 1850.00, 650.00, 2500.00, "pending", (datetime.now() + timedelta(days=30)).isoformat()),
        (customer_ids[3], vehicle_ids[4], "A/C System Repair", "AC compressor and condenser replacement", 560.00, 380.00, 940.00, "approved", (datetime.now() + timedelta(days=15)).isoformat())
    ]
    
    for estimate in estimates_data:
        cursor.execute('''
            INSERT OR IGNORE INTO estimates (customer_id, vehicle_id, title, description, labor_cost, parts_cost, total_cost, status, valid_until)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', estimate)
    
    print(f"✅ Added {len(estimates_data)} sample estimates")
    
    # Sample parts inventory
    parts_data = [
        ("Oil Filter", "OF-1001", "Standard oil filter for most vehicles", 8.50, 15.00, 25, 5, "AutoZone", "Filters"),
        ("Brake Pads (Front)", "BP-F001", "Ceramic brake pads - front set", 45.00, 85.00, 12, 3, "NAPA", "Brakes"),
        ("Air Filter", "AF-2001", "Engine air filter", 12.00, 25.00, 15, 5, "Advance Auto", "Filters"),
        ("Spark Plugs (Set of 4)", "SP-4001", "Platinum spark plugs", 28.00, 55.00, 8, 2, "AutoZone", "Ignition"),
        ("Transmission Fluid (Quart)", "TF-Q001", "Full synthetic transmission fluid", 11.00, 18.00, 20, 5, "Valvoline", "Fluids")
    ]
    
    for part in parts_data:
        cursor.execute('''
            INSERT OR IGNORE INTO parts (name, part_number, description, cost, price, quantity_on_hand, reorder_level, supplier, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', part)
    
    print(f"✅ Added {len(parts_data)} sample parts")
    
    # Sample diagnostic codes
    diagnostic_codes_data = [
        (vehicle_ids[4], None, "P0420", "Catalyst System Efficiency Below Threshold (Bank 1)", "medium", "Replace catalytic converter or check for exhaust leaks"),
        (vehicle_ids[5], None, "P0171", "System Too Lean (Bank 1)", "medium", "Check for vacuum leaks, clean MAF sensor")
    ]
    
    for code in diagnostic_codes_data:
        cursor.execute('''
            INSERT OR IGNORE INTO diagnostic_codes (vehicle_id, job_id, code, description, severity, recommendation)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', code)
    
    print(f"✅ Added {len(diagnostic_codes_data)} sample diagnostic codes")
    
    conn.commit()
    conn.close()
    
    print("🎉 Sample data initialization complete!")
    print("📊 Database now contains professional sample data for testing")

if __name__ == "__main__":
    init_sample_data()
EOF
    
    # Run the initialization
    python3 init_sample_data.py
    
    cd ..
    print_success "Database initialized with professional sample data"
}

# Create development scripts
create_dev_scripts() {
    print_step "Creating development scripts..."
    
    # Root level package.json for easy commands
    cat > package.json << 'EOF'
{
  "name": "eddies-automotive",
  "version": "1.0.0",
  "description": "Eddie's Askan Automotive Management System",
  "scripts": {
    "start": "concurrently \"npm run backend\" \"npm run frontend\"",
    "backend": "cd backend && source venv/bin/activate && python app.py",
    "frontend": "cd frontend && npm run dev",
    "backend:prod": "cd backend && source venv/bin/activate && gunicorn -w 4 -b 0.0.0.0:5000 app:app",
    "build": "cd frontend && npm run build",
    "test": "concurrently \"npm run test:backend\" \"npm run test:frontend\"",
    "test:backend": "cd backend && source venv/bin/activate && python -m pytest",
    "test:frontend": "cd frontend && npm test",
    "setup": "./setup.sh",
    "reset": "./reset.sh"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF
    
    # Install concurrently for running both servers
    npm install
    
    # Create start script
    cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Eddie's Automotive Development Environment..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"
npm start
EOF
    chmod +x start.sh
    
    # Create reset script
    cat > reset.sh << 'EOF'
#!/bin/bash
echo "🔄 Resetting Eddie's Automotive Environment..."
read -p "This will delete all data and reset the environment. Are you sure? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing backend database..."
    rm -f backend/eddie_automotive.db
    rm -f backend/*.log
    
    echo "Reinstalling frontend dependencies..."
    cd frontend && rm -rf node_modules && npm install && cd ..
    
    echo "Reinitializing database..."
    cd backend && source venv/bin/activate && python init_sample_data.py && cd ..
    
    echo "✅ Environment reset complete!"
else
    echo "Reset cancelled."
fi
EOF
    chmod +x reset.sh
    
    print_success "Development scripts created"
}

# Create production deployment files
create_production_files() {
    print_step "Creating production deployment files..."
    
    # Docker files
    cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
EOF
    
    cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
    
    # Nginx config for frontend
    cat > frontend/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html index.htm;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
EOF
    
    # Docker Compose
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_PATH=/data/eddie_automotive.db
    volumes:
      - ./data:/data
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  data:
EOF
    
    print_success "Production deployment files created"
}

# Final verification
verify_setup() {
    print_step "Verifying complete setup..."
    
    # Check backend
    cd backend
    if [ -f "app.py" ] && [ -f ".env" ] && [ -d "venv" ]; then
        print_success "Backend setup verified"
    else
        print_error "Backend setup incomplete"
        return 1
    fi
    cd ..
    
    # Check frontend
    cd frontend
    if [ -f "package.json" ] && [ -d "node_modules" ] && [ -f ".env" ]; then
        print_success "Frontend setup verified"
    else
        print_error "Frontend setup incomplete"
        return 1
    fi
    cd ..
    
    # Check database
    if [ -f "backend/eddie_automotive.db" ]; then
        print_success "Database initialized"
    else
        print_error "Database not found"
        return 1
    fi
    
    return 0
}

# Print final instructions
print_final_instructions() {
    echo -e "${GREEN}"
    echo "=============================================================================="
    echo "                    🎉 SETUP COMPLETE! 🎉"
    echo "=============================================================================="
    echo -e "${NC}"
    
    echo -e "${CYAN}🚀 Quick Start Commands:${NC}"
    echo -e "  ${GREEN}./start.sh${NC}          - Start both backend and frontend"
    echo -e "  ${GREEN}npm run backend${NC}     - Start only backend"
    echo -e "  ${GREEN}npm run frontend${NC}    - Start only frontend"
    echo -e "  ${GREEN}./reset.sh${NC}          - Reset environment and data"
    echo ""
    
    echo -e "${CYAN}🌐 Application URLs:${NC}"
    echo -e "  Frontend: ${BLUE}http://localhost:3000${NC}"
    echo -e "  Backend:  ${BLUE}http://localhost:5000${NC}"
    echo -e "  Health:   ${BLUE}http://localhost:5000/health${NC}"
    echo ""
    
    echo -e "${CYAN}🔐 Default Login:${NC}"
    echo -e "  Email:    ${YELLOW}admin@eddiesauto.com${NC}"
    echo -e "  Password: ${YELLOW}adminpassword${NC}"
    echo ""
    
    echo -e "${CYAN}⚙️ Configuration:${NC}"
    echo -e "  ${YELLOW}⚠️  Update backend/.env with your OpenAI/OpenRouter API keys${NC}"
    echo -e "  ${YELLOW}⚠️  Review frontend/.env for any customizations${NC}"
    echo ""
    
    echo -e "${CYAN}📊 Sample Data Included:${NC}"
    echo -e "  ${CHECK} 5 Professional customers"
    echo -e "  ${CHECK} 6 Realistic vehicles"
    echo -e "  ${CHECK} 5 Sample jobs with different statuses"
    echo -e "  ${CHECK} 2 Sample estimates"
    echo -e "  ${CHECK} 5 Parts inventory items"
    echo -e "  ${CHECK} Sample diagnostic codes"
    echo ""
    
    echo -e "${CYAN}🔧 Development Features:${NC}"
    echo -e "  ${CHECK} Hot reload for both frontend and backend"
    echo -e "  ${CHECK} Professional logging and error handling"
    echo -e "  ${CHECK} AI diagnostics and estimates"
    echo -e "  ${CHECK} OBD2 code lookup"
    echo -e "  ${CHECK} Time tracking system"
    echo -e "  ${CHECK} Complete CRUD operations"
    echo ""
    
    echo -e "${PURPLE}🎯 Million Dollar Features Enabled:${NC}"
    echo -e "  ${STAR} Professional UI/UX"
    echo -e "  ${STAR} AI-Powered Diagnostics"
    echo -e "  ${STAR} Real-time Updates"
    echo -e "  ${STAR} Mobile-Responsive Design"
    echo -e "  ${STAR} Advanced Search & Filtering"
    echo -e "  ${STAR} Comprehensive Reporting"
    echo -e "  ${STAR} Employee Time Tracking"
    echo -e "  ${STAR} Professional Estimates & Invoicing"
    echo ""
    
    echo -e "${GREEN}Ready to launch your million-dollar automotive software! 🚗💎${NC}"
}

# Main execution
main() {
    print_banner
    
    check_project_structure
    check_requirements
    setup_backend
    setup_frontend
    init_database
    create_dev_scripts
    create_production_files
    
    if verify_setup; then
        print_final_instructions
        echo -e "${GREEN}${ROCKET} Setup completed successfully!${NC}"
        exit 0
    else
        print_error "Setup verification failed. Please check the errors above."
        exit 1
    fi
}

# Run main function
main
