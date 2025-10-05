#!/bin/bash

# EcoSphere PostgreSQL Setup Script
# Run with: sudo bash setup_postgres.sh

set -e  # Exit on any error

echo "🚀 Starting EcoSphere PostgreSQL Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="ecosphere"
DB_USER="ecosphere_user"
DB_PASSWORD="ecopassword"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root (use sudo)"
    exit 1
fi

# Detect OS
if [ -f /etc/debian_version ]; then
    OS="debian"
    print_status "Detected Debian/Ubuntu system"
elif [ -f /etc/redhat-release ]; then
    OS="redhat"
    print_status "Detected RedHat/CentOS system"
else
    print_error "Unsupported operating system"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
if [ "$OS" = "debian" ]; then
    apt update -y
    apt upgrade -y
elif [ "$OS" = "redhat" ]; then
    yum update -y
fi
print_success "System packages updated"

# Install PostgreSQL
print_status "Installing PostgreSQL..."
if [ "$OS" = "debian" ]; then
    apt install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
elif [ "$OS" = "redhat" ]; then
    yum install -y postgresql postgresql-server postgresql-contrib
    postgresql-setup initdb
    systemctl enable postgresql
    systemctl start postgresql
fi
print_success "PostgreSQL installed and started"

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
sleep 3

# Create database and user
print_status "Creating database and user..."
sudo -u postgres psql << EOF
-- Create user
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';

-- Create database
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Additional privileges for the user
ALTER USER ${DB_USER} CREATEDB;
ALTER USER ${DB_USER} WITH SUPERUSER;

-- Show created user and database
\du
\l

-- Quit
\q
EOF

print_success "Database '${DB_NAME}' and user '${DB_USER}' created"

# Configure PostgreSQL for remote connections (optional)
print_status "Configuring PostgreSQL for connections..."

# Find PostgreSQL config directory
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oE '[0-9]+\.[0-9]+' | head -1)
if [ "$OS" = "debian" ]; then
    PG_CONFIG_DIR="/etc/postgresql/${PG_VERSION}/main"
elif [ "$OS" = "redhat" ]; then
    PG_CONFIG_DIR="/var/lib/pgsql/data"
fi

# Backup original configs
if [ -f "${PG_CONFIG_DIR}/postgresql.conf" ]; then
    cp "${PG_CONFIG_DIR}/postgresql.conf" "${PG_CONFIG_DIR}/postgresql.conf.backup"
    print_status "Backed up postgresql.conf"
fi

if [ -f "${PG_CONFIG_DIR}/pg_hba.conf" ]; then
    cp "${PG_CONFIG_DIR}/pg_hba.conf" "${PG_CONFIG_DIR}/pg_hba.conf.backup"
    print_status "Backed up pg_hba.conf"
fi

# Configure postgresql.conf for local and remote connections
if [ -f "${PG_CONFIG_DIR}/postgresql.conf" ]; then
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "${PG_CONFIG_DIR}/postgresql.conf"
    sed -i "s/#port = 5432/port = 5432/" "${PG_CONFIG_DIR}/postgresql.conf"
    print_status "Updated postgresql.conf"
fi

# Configure pg_hba.conf for authentication
if [ -f "${PG_CONFIG_DIR}/pg_hba.conf" ]; then
    # Add local connection for our user
    echo "local   ${DB_NAME}   ${DB_USER}   md5" >> "${PG_CONFIG_DIR}/pg_hba.conf"
    echo "host    ${DB_NAME}   ${DB_USER}   127.0.0.1/32   md5" >> "${PG_CONFIG_DIR}/pg_hba.conf"
    echo "host    ${DB_NAME}   ${DB_USER}   ::1/128        md5" >> "${PG_CONFIG_DIR}/pg_hba.conf"
    print_status "Updated pg_hba.conf"
fi

# Restart PostgreSQL to apply configurations
print_status "Restarting PostgreSQL..."
systemctl restart postgresql
sleep 2

# Test connection
print_status "Testing database connection..."
if sudo -u postgres psql -d ${DB_NAME} -U ${DB_USER} -h localhost -c "SELECT version();" > /dev/null 2>&1; then
    print_success "Database connection test successful!"
else
    print_warning "Database connection test failed, but this might be normal"
fi

# Install Node.js (if not present) for Prisma
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    if [ "$OS" = "debian" ]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt install -y nodejs
    elif [ "$OS" = "redhat" ]; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
        yum install -y nodejs
    fi
    print_success "Node.js installed"
else
    print_success "Node.js is already installed"
fi

# Configure firewall (optional)
print_status "Checking firewall configuration..."
if command -v ufw &> /dev/null; then
    ufw allow 5432/tcp
    print_status "UFW: Allowed PostgreSQL port 5432"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=5432/tcp
    firewall-cmd --reload
    print_status "Firewalld: Allowed PostgreSQL port 5432"
fi

# Create connection info file
print_status "Creating connection info file..."
cat > /tmp/postgres_connection_info.txt << EOF
====================================
EcoSphere PostgreSQL Setup Complete
====================================

Database Information:
- Database Name: ${DB_NAME}
- Username: ${DB_USER}
- Password: ${DB_PASSWORD}
- Host: localhost
- Port: 5432

Connection String:
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"

Next Steps:
1. Copy your ecosphere_backup.sql file to this server
2. Import the database:
   psql "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}" < ecosphere_backup.sql

3. Update your .env file with the connection string above
4. Run: npx prisma generate && npx prisma db push

Service Commands:
- Start:   sudo systemctl start postgresql
- Stop:    sudo systemctl stop postgresql
- Restart: sudo systemctl restart postgresql
- Status:  sudo systemctl status postgresql

====================================
EOF

print_success "Setup completed successfully!"
print_success "Connection info saved to: /tmp/postgres_connection_info.txt"

# Display connection info
echo ""
echo "======================================"
echo "🎉 SETUP COMPLETED SUCCESSFULLY! 🎉"
echo "======================================"
echo ""
echo "📋 Database Connection Info:"
echo "   Database: ${DB_NAME}"
echo "   User:     ${DB_USER}"
echo "   Password: ${DB_PASSWORD}"
echo "   Host:     localhost"
echo "   Port:     5432"
echo ""
echo "🔗 Connection String:"
echo "   DATABASE_URL=\"postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}\""
echo ""
echo "📄 Full details saved to: /tmp/postgres_connection_info.txt"
echo ""
echo "🚀 Next Steps:"
echo "1. Upload ecosphere_backup.sql to this server"
echo "2. Import: psql \"postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}\" < ecosphere_backup.sql"
echo "3. Update your .env file"
echo "4. Run: npx prisma generate && npx prisma db push"
echo ""
echo "======================================"