# LMS Backend (Express + MongoDB)

This is a starter REST API for the LMS specified by the user. It contains authentication, user model, and profile edit endpoints. More features (courses, categories, quizzes, certificates) will follow.

Quick start

1. Copy `.env.example` to `.env` and update values (MongoDB URI, JWT secret, optional admin seed credentials).

2. Install dependencies:

```bash
npm install
```

3. Start the server (development):

```bash
npm run dev
```

4. Seed an initial admin (if you set ADMIN_EMAIL and ADMIN_PASSWORD in `.env`):

```bash
curl -X POST http://localhost:4000/api/auth/seed-admin
```

5. Login:

```bash
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}'
```

6. Create employee (admin only):

```bash
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"email":"employee1@example.com","first_name":"Employee","last_name":"One"}'
```

Notes

- Passwords are hashed using bcrypt. For the admin-created employee flow the API returns a temporary password (in real production you would email this and force reset on first login).
- This initial scaffold implements only auth, user model and profile editing. We'll implement course/category/quiz/certificate features next.
