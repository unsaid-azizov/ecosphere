# EcoSphere

E-commerce platform for eco-friendly professional cleaning and hospitality products.

Built with Next.js 14, PostgreSQL, Prisma, Tailwind CSS, and shadcn/ui.

## Quick Start (Docker)

**Prerequisites:** Docker, Docker Compose, SSL certificate for your domain.

```bash
# 1. Clone the repo
git clone git@github.com:unsaid-azizov/ecosphere.git
cd ecosphere

# 2. Set up SSL (first time only)
sudo certbot certonly --standalone -d ecosphere.spb.ru -d www.ecosphere.spb.ru

# 3. Create .env from template
cp .env.example .env
# Edit .env — at minimum set NEXTAUTH_SECRET:
#   openssl rand -base64 32

# 4. Launch
docker compose up --build -d
```

The site will be available at `https://ecosphere.spb.ru`.

## Architecture

```
docker compose up --build -d
├── db        PostgreSQL 16 (port 5432, internal)
├── app       Next.js standalone (port 3000, internal)
└── nginx     Reverse proxy + SSL (ports 80, 443)
```

- **Database** is initialized from `docker/db/init.sql` on first run.
- **Product images** are stored in `data/images/` and copied into the app image during Docker build with correct naming (`/uploads/products/product_{id}_{n}.jpg`).
- **nginx** terminates SSL, serves uploaded images directly, and proxies everything else to the app.
- **Uploads** persist in a Docker volume (`uploads`), shared between `app` and `nginx`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_SECRET` | Yes | Secret for session encryption (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | No | Site URL (default: `https://ecosphere.spb.ru`) |
| `NEXT_PUBLIC_BASE_URL` | No | Public base URL (default: `https://ecosphere.spb.ru`) |
| `DB_PASSWORD` | No | PostgreSQL password (default: `ecopassword`) |
| `TELEGRAM_BOT_TOKEN` | No | Telegram bot token for order notifications |

## Common Commands

```bash
# Rebuild and restart
docker compose up --build -d

# View logs
docker compose logs -f app

# Stop everything
docker compose down

# Stop and remove data (full reset)
docker compose down -v

# Access database
docker compose exec db psql -U ecosphere_user -d ecosphere
```

## Development (without Docker)

```bash
npm install
cp .env.example .env
# Edit .env: set DATABASE_URL to a local PostgreSQL instance
npx prisma generate
npx prisma db push
npm run dev
```

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, shadcn/ui, Radix UI
- **Backend:** Next.js API Routes, NextAuth.js (credentials)
- **Database:** PostgreSQL 16, Prisma ORM
- **Deployment:** Docker Compose, nginx, Let's Encrypt
