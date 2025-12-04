# LMS Backend (Express + MongoDB)

Complete REST API for an LMS system with admin course/quiz management, employee enrollment, progress tracking, and certificate generation.

## Quick Start

1. **Copy `.env.example` to `.env`** and update values
2. **Install dependencies:** `npm install`
3. **Start server:** `npm run dev`
4. **Seed admin:** `curl -X POST http://localhost:4000/api/auth/seed-admin`
5. **Login:** `curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}'`

## Core Features

- **Authentication**: Login with JWT, admin seed, employee registration
- **Categories**: Admin CRUD; public read
- **Courses**: Admin create/edit/deactivate with chapters/lessons; public search/list
- **Enrollments**: Employee enroll, mark lessons complete, track progress
- **Quizzes**: Admin create/deactivate; employee attempt with grading
- **Certificates**: PDF generation on quiz pass; admin list all, employees view own
- **Employee Dashboard**: View all enrollments with progress and next lesson
- **Admin Management**: List employees with pagination, deactivate accounts and quizzes

## API Endpoints

### Admin Employee Management
- `GET /api/admin/employees` — List employees (page, limit, active filter)
- `POST /api/admin/employees/:employeeId/deactivate` — Deactivate employee account

### Admin Quiz Management
- `POST /api/admin/quizzes/:quizId/deactivate` — Deactivate quiz (not visible to employees)

See README.md in full for complete endpoint documentation and workflow examples.
