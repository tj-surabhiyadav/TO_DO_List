# Task Management API

A professional NestJS, TypeORM, and PostgreSQL REST API for users and tasks, completed through the Day 2 enhancement requirements.

## Features

- Modular NestJS architecture with User, Task, and Auth modules
- PostgreSQL integration through TypeORM
- UUID primary keys and one-to-many user-task relationship
- DTO validation for required fields, emails, UUIDs, enums, and query params
- Structured global error responses
- Request logging middleware
- Swagger API documentation at `/api/docs`
- JWT login for existing users
- Task filtering by status
- Pagination with `limit` and `offset`
- User-specific task lookup
- Soft delete for tasks

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
JWT_SECRET=replace-with-a-strong-secret
```

`DB_SYNC=true` is convenient for local development. Use migrations and disable synchronization for production deployments.

## Swagger

Open the interactive API documentation after starting the app:

```http
GET /api/docs
```

## Auth Flow

Create a user first, then log in with that user's email.

```http
POST /auth/login
```

```json
{
  "email": "ada@example.com"
}
```

Use the returned token as:

```http
Authorization: Bearer <accessToken>
```

Task write operations require this bearer token.

## API Endpoints

### Users

```http
POST /users
GET /users
GET /users/:id
GET /users/:id/tasks
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
GET /tasks?status=TODO&limit=10&offset=0
GET /tasks/:id
PATCH /tasks/:id
PATCH /tasks/:id/status
DELETE /tasks/:id
```

Create task body:

```json
{
  "title": "Build task API",
  "description": "Implement CRUD endpoints with validation",
  "userId": "b657a7d2-b9f6-4c11-844a-d46f0cf7298a"
}
```

`status` is optional during creation and defaults to `TODO`.

Update task status body:

```json
{
  "status": "IN_PROGRESS"
}
```

Allowed task statuses:

- `TODO`
- `IN_PROGRESS`
- `DONE`

## Error Response Shape

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Task not found",
  "timestamp": "2026-05-11T07:00:00.000Z",
  "path": "/tasks/bad-id",
  "method": "GET"
}
```

## Verification

```bash
npm run lint
npm run build
npm test
```

## Postman Collection

Import [PostManCollection.json](/Users/admin/work/Nest/nest-core/PostManCollection.json) into Postman to test all API endpoints.
