
# MBD Academy NestJS Example

This is a minimal but functional example of an MBD Academy backend built with NestJS, Prisma, PostgreSQL, Swagger, Joi validation, JWT authentication, role-based authorization, centralized logging and exception handling, plus pagination and filters for endpoints.

## Quickstart

1. Copy `.env.example` to `.env` and update `DATABASE_URL` and `JWT_SECRET`.
2. Start Postgres using docker-compose:
   ```bash
   docker compose up -d
   ```
   (This will run Postgres on port 5432 with user `postgres` / password `postgres` and db `academy`.)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Generate Prisma client & run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Start the app:
   ```bash
   npm run start
   ```

6. Open Swagger at http://localhost:3000/api

## What is included
- Prisma schema (in `prisma/schema.prisma`) — the one you provided.
- Auth endpoints: `POST /auth/register`, `POST /auth/login` (Joi used inside controller).
- Courses endpoints with pagination and filters: `GET /courses` and `GET /courses/:id` and `POST /courses` (protected).
- Roles decorator & guard example (uses Role names stored in DB).
- Central logging interceptor & exception filter.
- Docker Compose for Postgres (`docker-compose.yml`).

This is a scaffold; you can expand services/controllers as needed.


## Seeds & Additional modules

- Run `npm run seed` to populate Roles (`admin`, `trainer`, `user`) and an initial admin user (`admin@example.com` / `AdminPassword123!`).
- New modules added: Categories, Articles, Feedback, Enrollments. Each has basic controllers, services, pagination and filters where meaningful.


## Added global Joi validation interceptor & DTOs
- Implemented a global JoiValidationInterceptor that reads `@JoiSchema(...)` metadata and validates incoming request bodies, populating `req.body` with the validated value.
- Added DTO classes (with Swagger decorators) under `src/dto` and improved Swagger documentation for new endpoints.
- Added Trainers, Levels, Pricing, Contact modules and file upload support for trainer images (uploads stored under `uploads/`).
- Don't forget to create the `uploads/` directory or ensure the app can write to it.
