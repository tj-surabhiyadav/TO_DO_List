# Task Management API

A professional NestJS, TypeORM, and PostgreSQL REST API for managing users and their tasks.

## Features

- Modular NestJS architecture with separate User and Task modules
- PostgreSQL integration through TypeORM
- UUID primary keys for users and tasks
- One-to-many user-task relationship
- DTO validation with `class-validator`
- Consistent HTTP errors for duplicate users, missing users, and missing tasks
- Environment-based configuration

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

Update `.env` with your local PostgreSQL credentials before starting the API.

## Environment Variables

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=task_management
DB_SYNC=true
```

`DB_SYNC=true` is convenient for local development. Use migrations and disable synchronization for production deployments.

## API Endpoints

### Users

```http
POST /users
GET /users
GET /users/:id
PATCH /users/:id
DELETE /users/:id
```

Create user body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
```

### Tasks

```http
POST /tasks
GET /tasks
GET /tasks/:id
PATCH /tasks/:id
DELETE /tasks/:id
```

Create task body:

```json
{
  "title": "Build task API",
  "description": "Implement CRUD endpoints with validation",
  "status": "TODO",
  "userId": "b657a7d2-b9f6-4c11-844a-d46f0cf7298a"
}
```

Allowed task statuses:

- `TODO`
- `IN_PROGRESS`
- `DONE`

## Validation

The API rejects unknown fields and validates required fields, email format, UUID params, UUID foreign keys, and task status enum values.

## Verification

```bash
npm run build
npm test
```
