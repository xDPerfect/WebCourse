Приложение "Менеджер задач".

Технологии:
Frontend - React (HTML/CSS/Javascript)
Backend - PHP 8+/Laravel/Eloquent
Database - MariaDB

## Запуск приложения

### Требования

- Docker Desktop (Windows) или Docker Engine + Docker Compose (Linux/macOS)
- Интернет — только для первой сборки (скачивание базовых образов и пакетов)

Отдельно устанавливать PHP, Node.js, npm или MariaDB не нужно — всё работает внутри Docker-контейнеров.

### Сборка и запуск

Из папки проекта, где лежит `docker-compose.yaml`:

docker compose up --build -d

Поднимутся 3 контейнера:

frontend - http://localhost:5173 - React (Vite) — интерфейс

backend	- http://localhost:8000 - Laravel — REST API

database - (только внутри Docker) MariaDB

После запуска откройте в браузере: http://localhost:5173

## Примечания

При первом запуске база пустая: справочники созданы автоматически, задачи, категории и теги добавляются через интерфейс.

Если порты 5173 или 8000 уже заняты — измените их в docker-compose.yaml в секциях ports.

Не используйте docker compose down -v — эта команда удаляет данные базы.