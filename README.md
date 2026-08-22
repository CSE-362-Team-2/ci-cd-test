# Full-Stack Application (Hono + PostgreSQL + Docker)

This repository contains a full-stack application built with **Hono** (Node.js API), **PostgreSQL** (Database), and a frontend client.

---

## Prerequisites

Ensure you have the following installed on your development machine:

- **[Node.js](https://nodejs.org/)** (v22 or higher)
- **[pnpm](https://pnpm.io/)** (Enable via Corepack: `corepack enable`)
- **[Docker](https://www.docker.com/)** & **Docker Compose**

---

## Environment Configuration

Create a `.env` file in the root directory:

```bash
POSTGRES_DB_NAME=myappdb_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=devpassword123
POSTGRES_PORT=5432
```

Enable corepack.

```bash
corepack enable
```

## Running for Development

1. Start the Database container:

```bash
docker compose up -d db
```

2. Install dependencies and start the Server:

```bash
cd server
pnpm install

pnpm dev
```

3. Install dependencies and start the Client:

```bash
cd client
pnpm install

pnpm dev
```

## Running for Production

```bash
# Build and start all services in detached mode
docker compose up -d --build

# View real-time logs across all services
docker compose logs -f

# View logs for server only
docker compose logs -f server
```

## Database Management

```bash
# Open interactive psql prompt
docker exec -it ci-cd-test-db-1 psql -U postgres -d myappdb_dev
```

## Running API Tests with Newman

```
pnpm dlx newman run server/tests/postman/<test_file>.json
```

## Stopping and Cleaning up

```bash
# Stop containers
docker compose down

# Stop containers AND remove persistent database volumes
docker compose down -v
```

## Service Ports and Addresses

| Service                 | Local URL / Address         | Container Port |
| :---------------------- | :-------------------------- | :------------- |
| **Client**              | `http://localhost`          | 80             |
| **Hono API Server**     | `http://localhost:5000`     | 5000           |
| **PostgreSQL Database** | `postgres://localhost:5432` | 5432           |
