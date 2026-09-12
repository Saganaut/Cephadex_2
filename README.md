# Cephadex

Cephadex is an educational platform that uses AI to turn study material into interactive learning tools for students and educators. It converts PDFs, documents, web pages and audio into flashcards and notes, and adds spaced repetition, quizzes and multiplayer games on top.

## Project Status

**This project is archived and kept online for demonstration purposes only.** A demo is available at [cephadex.com](https://www.cephadex.com), but the codebase is no longer maintained.

Features that depend on third‑party services are **not functional** because the associated API keys have expired:

- AI content generation and study notes (OpenAI / Anthropic)
- The RAG chatbot
- OAuth sign‑in (Google, Discord, Microsoft)
- Payments and subscriptions (Stripe)
- Transactional email (SendGrid)

The core UI remains browsable. No support or further development is planned.

## Features

- **AI content generation** – flashcards and study notes from PDFs, DOCX, web pages and audio
- **Chatbot** – context‑aware answers over your own study materials using RAG
- **Spaced repetition** – optimised review schedules with progress tracking
- **Multiplayer games** – real‑time knowledge competitions with leaderboards
- **Quizzes** – custom quizzes with automated grading and performance analytics

## Tech Stack

**Backend**

- FastAPI, SQLAlchemy, Pydantic
- PostgreSQL (primary database), Redis Stack (cache, job queue, RediSearch, RedisJSON)
- JWT + OAuth2 authentication
- S3‑compatible object storage (MinIO locally, AWS S3 in production)
- OpenAI and Anthropic Claude for AI features; Stripe (payments); SendGrid (email)
- Tests: Pytest (see `server/tests/README.md`)

**Frontend**

- React + TypeScript (Vite)
- Redux Toolkit for state, TailwindCSS for styling
- Tests: Vitest + React Testing Library + MSW (see `frontend/TESTING.md`)

## Architecture

1. **Server** – FastAPI backend: API, auth, and coordination with AI providers
2. **Job Processing Service** – asynchronous content generation and file processing
3. **Cron Service** – subscription rollovers and scheduled maintenance
4. **Redis Stack** – job queues, caching, full‑text search and JSON storage
5. **PostgreSQL** – users, content and relationships
6. **MinIO** – S3‑compatible storage for uploads and generated content

## Getting Started

### Environment

The compose files expect environment files at the repository root:

- `compose.dev.yml` → `.env.dev` (plus `frontend/.env.development`)
- `compose.prod.yml` → `.env`

The variables the backend reads are defined in `server/config.py`.

### Run with Docker

```bash
docker compose -f compose.dev.yml up     # development
docker compose -f compose.prod.yml up    # production
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # dev server
npm run build    # production build
npm run lint     # ESLint
npm run test     # Vitest
```

### Backend

```bash
cd server
uvicorn main:app --host 127.0.0.1 --port 5000 --reload
uv run pytest    # tests
ruff check       # lint
ruff format      # format
```

### API Docs and Type Generation

With the server running, Swagger UI is at `/docs` and the OpenAPI spec at `/openapi.json`.

Frontend TypeScript types are generated from the OpenAPI spec. After changing the API, with the server running on port 5000:

```bash
cd frontend
npm run generate-client
```

## Repository Layout

```
frontend/         React + TypeScript application
server/           FastAPI backend, models, routes and tests
services/         Supporting service configuration (db, redis)
nginx/            Nginx configuration
deploy/           Deployment scripts and Docker assets
compose.*.yml     Docker Compose configurations
```

## License

Proprietary and Confidential

Copyright (c) 2024 Cephadex. All Rights Reserved.

This software and its documentation are protected by copyright law and international treaties. Unauthorized reproduction, distribution, or use of this software, its source code, documentation, or any other materials in this repository is strictly prohibited without the express written permission of Cephadex.

No part of this software may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of Cephadex.

For licensing inquiries, please contact: support@cephadex.com
