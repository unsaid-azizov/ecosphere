#!/bin/bash

# Скрипт автоматической очистки изображений
# Запускать через cron каждые 24 часа: 0 2 * * * /path/to/cleanup-images.sh

# Настройки
CLEANUP_URL="http://localhost:3002/api/cron/cleanup-images"
SECRET_KEY="default-cleanup-key"
LOG_FILE="/var/log/ecosphere-cleanup.log"

# Функция логирования
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Проверяем доступность сервера
if ! curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    log "ERROR: Server is not running"
    exit 1
fi

log "Starting automatic image cleanup..."

# Выполняем очистку
RESPONSE=$(curl -s -X GET \
    -H "Authorization: Bearer $SECRET_KEY" \
    "$CLEANUP_URL")

# Проверяем результат
if echo "$RESPONSE" | grep -q '"success":true'; then
    DELETED=$(echo "$RESPONSE" | grep -o '"deleted":[0-9]*' | cut -d':' -f2)
    FILES=$(echo "$RESPONSE" | grep -o '"files":[0-9]*' | cut -d':' -f2)
    SIZE=$(echo "$RESPONSE" | grep -o '"sizeFormatted":"[^"]*"' | cut -d'"' -f4)
    
    log "SUCCESS: Cleanup completed. Deleted: $DELETED files, Total files: $FILES, Size: $SIZE"
else
    log "ERROR: Cleanup failed - $RESPONSE"
    exit 1
fi

log "Automatic cleanup finished"
