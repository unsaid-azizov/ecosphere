#!/bin/bash

# EcoSphere Database Import Script
# Run after setup_postgres.sh
# Usage: bash import_database.sh path/to/ecosphere_backup.sql

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Database configuration (same as setup script)
DB_NAME="ecosphere"
DB_USER="ecosphere_user"
DB_PASSWORD="ecopassword"
CONNECTION_STRING="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"

echo "🔄 Starting EcoSphere Database Import..."

# Check if backup file is provided
if [ -z "$1" ]; then
    print_error "Please provide path to backup file"
    echo "Usage: bash import_database.sh path/to/ecosphere_backup.sql"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

print_status "Using backup file: $BACKUP_FILE"
print_status "File size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Test database connection first
print_status "Testing database connection..."
if psql "$CONNECTION_STRING" -c "SELECT version();" > /dev/null 2>&1; then
    print_success "Database connection successful"
else
    print_error "Cannot connect to database. Make sure PostgreSQL is running and configured correctly."
    exit 1
fi

# Import the database
print_status "Importing database... This may take a while."
if psql "$CONNECTION_STRING" < "$BACKUP_FILE"; then
    print_success "Database imported successfully!"
else
    print_error "Database import failed"
    exit 1
fi

# Verify import
print_status "Verifying import..."
TABLE_COUNT=$(psql "$CONNECTION_STRING" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
print_success "Found $TABLE_COUNT tables in database"

# List all tables
print_status "Available tables:"
psql "$CONNECTION_STRING" -c "\dt"

print_success "✅ Database import completed successfully!"
echo ""
echo "🔗 Connection String: $CONNECTION_STRING"
echo "📊 Tables imported: $TABLE_COUNT"
echo ""
echo "🚀 Next steps:"
echo "1. Update your .env file with the connection string above"
echo "2. In your project directory, run:"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo "3. Start your application!"