# Docker Development Guide

> 容器化开发和测试指南 / Containerization for development and testing

---

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.x

Verify with:
```bash
docker --version      # Docker version 20+
docker compose version  # Docker Compose version v2.x
```

---

## 🚀 Quick Start

### Production Build (Recommended for Testing)

```bash
# Build and run the web app
docker compose up web

# Or rebuild from scratch
docker compose up web --build

# Access at http://localhost:3000
```

### Development Mode (Hot Reload)

```bash
# Start with hot reload (volume mounts your code)
docker compose --profile dev up web-dev

# Changes to your code will auto-refresh
```

### With LocalStack (AWS Emulation)

```bash
# Start web + LocalStack (DynamoDB, S3, Cognito, Lambda)
docker compose --profile local-aws up

# LocalStack dashboard: http://localhost:4566
```

---

## 📦 Services

| Service | Port | Profile | Description |
|---------|------|---------|-------------|
| `web` | 3000 | (default) | Production Next.js build |
| `web-dev` | 3000 | `dev` | Development with hot reload |
| `localstack` | 4566 | `local-aws` | AWS services emulation |

---

## 🔧 Common Commands

```bash
# Start services
docker compose up web              # Production web
docker compose --profile dev up    # Development mode
docker compose up -d               # Detached (background)

# Stop services
docker compose down                # Stop and remove containers
docker compose down -v             # Also remove volumes

# Rebuild
docker compose build web           # Rebuild web image
docker compose build --no-cache    # Full rebuild (no cache)

# Logs
docker compose logs -f web         # Follow web logs
docker compose logs --tail=100     # Last 100 lines

# Shell access
docker compose exec web sh         # Shell into running container
docker compose run --rm web sh     # New container with shell

# Cleanup
docker system prune -f             # Remove unused data
docker volume prune -f             # Remove unused volumes
```

---

## 🌍 Environment Variables

Create `.env` in project root (or copy from `.env.example`):

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_ENV=development

# AWS (for LocalStack)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
AWS_ENDPOINT_URL=http://localhost:4566
```

---

## 🏗️ Build Arguments

The web Dockerfile accepts build args:

```bash
docker compose build web \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_APP_ENV=staging
```

---

## 📁 File Structure

```
fawkes/
├── .dockerignore           # Files excluded from Docker context
├── docker-compose.yml      # Service definitions
├── apps/
│   └── web/
│       ├── Dockerfile      # Multi-stage production build
│       └── .dockerignore   # Web-specific exclusions
```

---

## 🧪 Testing Docker Builds

### Verify the image builds

```bash
# Build the image
docker compose build web

# Check image size
docker images | grep fawkes
```

### Verify the container runs

```bash
# Start and check health
docker compose up web -d
docker compose ps

# Check logs for errors
docker compose logs web

# Test health endpoint
curl http://localhost:3000/api/health
```

### Run in CI/CD

```yaml
# Example GitHub Actions step
- name: Build and test Docker
  run: |
    docker compose build web
    docker compose up web -d
    sleep 10
    curl --fail http://localhost:3000/api/health
    docker compose down
```

---

## 🤖 Agent Instructions

### Building the Web Image

```markdown
Task: Build and run the web Docker container

Steps:
1. Ensure Docker is running: `docker info`
2. Build: `docker compose build web`
3. Run: `docker compose up web -d`
4. Verify: `curl http://localhost:3000/api/health`
5. Check logs if issues: `docker compose logs web`
```

### Debugging Build Failures

```markdown
If the Docker build fails:

1. Check the build stage that failed (deps, builder, runner)
2. Common issues:
   - Missing package.json files → Update COPY commands in Dockerfile
   - pnpm-lock.yaml out of sync → Run `pnpm install` locally first
   - Build errors → Run `pnpm build` locally to see full error

3. For node_modules issues:
   docker compose build --no-cache web
```

### Adding New Packages to Monorepo

```markdown
When adding new packages that web depends on:

1. Add the package.json COPY line in Dockerfile deps stage:
   COPY packages/new-package/package.json ./packages/new-package/

2. Add the node_modules COPY in builder stage:
   COPY --from=deps /app/packages/new-package/node_modules ./packages/new-package/node_modules 2>/dev/null || true

3. Rebuild: `docker compose build --no-cache web`
```

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill it or change the port in docker-compose.yml
```

### Container exits immediately

```bash
# Check logs for the error
docker compose logs web

# Common causes:
# - Missing environment variables
# - Build output not in expected location
# - Node.js runtime error
```

### Build cache issues

```bash
# Full clean rebuild
docker compose down -v
docker system prune -f
docker compose build --no-cache web
```

### LocalStack not working

```bash
# Check LocalStack health
curl http://localhost:4566/_localstack/health

# View LocalStack logs
docker compose logs localstack

# Ensure Docker socket is accessible
ls -la /var/run/docker.sock
```

---

## 🔗 Related Docs

- [RUNBOOK.md](RUNBOOK.md) - Main technical documentation
- [QUICK_START.md](QUICK_START.md) - Project setup guide
- [AGENT_INTERACTION.md](AGENT_INTERACTION.md) - Working with AI agents
