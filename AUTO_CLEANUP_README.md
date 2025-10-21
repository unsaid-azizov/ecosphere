# Автоматическая очистка изображений - Настройка

## 🚀 Уровни автоочистки

### 1. **Автоматическая очистка при операциях с товарами**
✅ **Настроено автоматически:**
- При удалении товара → удаляются все его изображения
- При обновлении товара → удаляются старые изображения
- При загрузке нового изображения → старые версии удаляются

### 2. **Ручная очистка через админ-панель**
✅ **Добавлена кнопка в админ-панели:**
- Перейдите в `/admin/products`
- Нажмите "Очистить неиспользуемые изображения"
- Показывает статистику: количество удаленных файлов, размер папки

### 3. **Автоматическая очистка по расписанию**
✅ **API endpoint создан:** `/api/cron/cleanup-images`
✅ **Скрипт создан:** `scripts/cleanup-images.sh`

## ⚙️ Настройка cron для автоматической очистки

### Вариант 1: Через crontab
```bash
# Открыть crontab
crontab -e

# Добавить строку для очистки каждые 24 часа в 2:00
0 2 * * * /home/said/projects/ecosphere/scripts/cleanup-images.sh
```

### Вариант 2: Через systemd timer
```bash
# Создать файл сервиса
sudo nano /etc/systemd/system/ecosphere-cleanup.service

# Содержимое:
[Unit]
Description=Ecosphere Image Cleanup
After=network.target

[Service]
Type=oneshot
ExecStart=/home/said/projects/ecosphere/scripts/cleanup-images.sh
User=said
Group=said

# Создать файл таймера
sudo nano /etc/systemd/system/ecosphere-cleanup.timer

# Содержимое:
[Unit]
Description=Run Ecosphere cleanup daily
Requires=ecosphere-cleanup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target

# Активировать
sudo systemctl enable ecosphere-cleanup.timer
sudo systemctl start ecosphere-cleanup.timer
```

### Вариант 3: Через внешний сервис (GitHub Actions, etc.)
```bash
# URL для вызова
curl -X GET \
  -H "Authorization: Bearer default-cleanup-key" \
  http://your-domain.com/api/cron/cleanup-images
```

## 🔧 Настройки

### Переменные окружения
```bash
# В .env файле
CLEANUP_SECRET_KEY=your-secret-key-here
```

### Логи
- Логи сохраняются в `/var/log/ecosphere-cleanup.log`
- Можно изменить путь в скрипте `scripts/cleanup-images.sh`

## 📊 Что очищается

### Автоматически удаляются:
- ✅ Файлы старше 30 дней
- ✅ Неиспользуемые изображения
- ✅ Поврежденные файлы

### НЕ удаляются:
- ❌ Изображения, используемые в товарах
- ❌ Файлы младше 30 дней
- ❌ Внешние ссылки на изображения

## 🚨 Безопасность

- API защищен секретным ключом
- Доступ только для авторизованных пользователей
- Логирование всех операций
- Резервное копирование перед удалением (опционально)

## 📈 Мониторинг

### Проверка статуса:
```bash
# Проверить размер папки uploads
curl -s http://localhost:3002/api/admin/cleanup/images | jq .uploadsInfo

# Проверить логи очистки
tail -f /var/log/ecosphere-cleanup.log
```

### Статистика:
- Количество удаленных файлов
- Размер освобожденного места
- Количество ошибок
- Время выполнения
