# Claude Development Guide for Cephadex

This file helps Claude understand the Cephadex project structure and development workflows.

## Project Overview

Cephadex is an AI-powered educational platform built as a monorepo with:
- **Frontend**: React + TypeScript + TailwindCSS + Redux Toolkit
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL + Redis
- **AI Integration**: OpenAI + Anthropic Claude
- **Infrastructure**: Docker containerized with dev/prod configurations

### Project Status
This project is archived and kept online only as a demo (https://www.cephadex.com). Features that
depend on third-party services are **not functional** because their API keys have expired: AI
content generation and the RAG chatbot (OpenAI/Anthropic), OAuth sign-in (Google/Discord/Microsoft),
Stripe payments and SendGrid email. Do not assume these code paths work end-to-end.

## Architecture

### Core Services

1. **Server** (`/server`) - FastAPI backend with API endpoints
2. **Frontend** (`/frontend`) - React TypeScript application
3. **Job Processing Service** - Async content generation and AI processing
4. **Cron Service** - Scheduled tasks and subscription management
5. **Redis Stack** - Caching, job queues, search (RediSearch), JSON storage
6. **PostgreSQL** - Primary relational database
7. **MinIO** - S3-compatible object storage

### Key Features

- AI-powered content generation (flashcards, notes from PDFs/audio/web)
- Intelligent chatbot with RAG (Retrieval-Augmented Generation)
- Spaced repetition system for learning
- Multiplayer knowledge games
- Quiz management and automated grading
- OAuth2 authentication (Google, Discord, Microsoft)

## Development Commands

### Frontend (`/frontend`)

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint checking
npm run generate-client  # Generate API types from OpenAPI spec
```

### Backend (`/server`)

```bash
# Python environment management
cd server && source myenv/bin/activate

# Linting and formatting
ruff check           # Lint Python code
ruff format          # Format Python code

# Testing
uv run pytest       # Run tests with UV
uv run pytest tests/ # Run specific test directory with UV
pytest               # Run tests (legacy, use UV version above)
pytest tests/        # Run specific test directory (legacy)
```

### Docker Development

```bash
docker compose -f compose.dev.yml up    # Start all development services
docker compose -f compose.prod.yml up   # Start production services
```

## Project Structure

```
/
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── types/      # TypeScript type definitions
│   │   ├── client/     # Generated API client
│   │   └── ...
│   └── package.json
├── server/             # FastAPI backend
│   ├── models/         # SQLAlchemy models
│   ├── routes/         # API route handlers
│   ├── tests/          # Test files
│   ├── dependencies/   # Dependency injection
│   └── pyproject.toml  # Python project config (Ruff settings)
├── services/           # Additional services
├── nginx/              # Nginx configuration
├── deploy/             # Deployment scripts
└── compose.*.yml       # Docker compose configurations
```

## Important Files

- `README.md` - Main project documentation
- `compose.dev.yml` / `compose.prod.yml` - Docker configurations
- `frontend/package.json` - Frontend dependencies and scripts
- `server/pyproject.toml` - Backend linting configuration (Ruff)
- `.env*` - Environment configurations
- `frontend/src/types/api` - Generated TypeScript types

## Testing

### Backend

- Framework: Pytest
- Location: `server/tests/`
- Coverage: Currently low, needs improvement
- Run: `cd server && pytest`

### Frontend

- Framework: Vitest + React Testing Library + MSW (see `frontend/TESTING.md`)
- Run: `cd frontend && npm run test`

## API Documentation

- Swagger UI: Available at `/docs` when server is running
- OpenAPI spec: Available at `/openapi.json`
- Type generation: Frontend types auto-generated from OpenAPI

## Common Tasks

### Regenerate Frontend API Types

```bash
cd frontend
npm run generate-client
```

### Add New Dependencies

```bash
# Frontend
cd frontend && npm install <package>

# Backend (in virtual environment)
cd server && pip install <package>
```

### Database Changes

- Models located in `server/models/`
- Use SQLAlchemy for database operations
- PostgreSQL as primary database

### Environment Setup

- Development: Use `compose.dev.yml`
- Production: Use `compose.prod.yml`
- Environment variables in `.env*` files

## Code Quality

### Backend (Python)

- Linter: Ruff (configured in `pyproject.toml`)
- Line length: 100 characters
- Many rules ignored for practical development

### Frontend (TypeScript)

- Linter: ESLint with TypeScript rules
- Formatter: Prettier
- Style: TailwindCSS

## Notes for Claude

- Always check existing patterns before implementing new features
- Follow the established architecture (FastAPI backend, React frontend)
- Use existing utilities and libraries where possible
- Check `package.json` / `pyproject.toml` for available dependencies
- Maintain type safety between frontend and backend using generated types
- Consider async job processing for heavy AI operations
