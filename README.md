# multi-tenant-saas
🚀 Multi-Tenant SaaS Application

A full-stack Multi-Tenant SaaS application built using Node.js, Express, PostgreSQL, Docker, and React.
This project demonstrates authentication, tenant isolation, role-based access, CRUD operations, and dashboard analytics.

📌 Features
🔐 Authentication & Authorization

Tenant-based login

JWT authentication (24-hour token)

Role-based access (super_admin, tenant_admin)

Secure password hashing using bcrypt

🏢 Multi-Tenancy

Separate tenants using tenant_id

Data isolation per tenant

Subdomain-based tenant login

📊 Dashboard

Total Projects count

Total Tasks count

Total Users count

Tenant-specific analytics

📁 Projects Management

Create Project

View Projects

Tenant-isolated projects

Project status tracking

✅ Tasks Management

Create Task under a Project

View Tasks

Task status handling

Project-task relationship enforced via foreign keys

👥 Users Management

View tenant users

Role-based user access

Tenant-admin visibility

🧱 Tech Stack
Backend

Node.js

Express.js

PostgreSQL

JWT

bcrypt

Docker & Docker Compose

Frontend

React

React Router DOM

Fetch API

Simple UI (focus on functionality)

📂 Project Structure
multi-tenant-saas/
│
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── users.js
│   │   ├── tenants.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js
│   ├── seeds/
│   │   └── seed.sql
│   ├── migrate.js
│   ├── db.js
│   ├── server.js
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── api.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── submission.json
🛠️ Setup & Run Instructions
1️⃣ Clone Repository
git clone <your-repo-url>
cd multi-tenant-saas

2️⃣ Run using Docker
docker compose up --build


✔ Backend → http://localhost:5000
✔ Frontend → http://localhost:3000

3️⃣ Health Check
curl http://localhost:5000/api/health

🔑 Default Credentials (Seeded)
Demo Tenant
Email: admin@demo.com
Password: Demo@123
Tenant: demo

Stable Tenant
Email: admin@stableco.com
Password: Test@1234
Tenant: stableco

🔗 API Endpoints
Authentication

POST /api/auth/login

POST /api/auth/register-tenant

Dashboard

GET /api/dashboard (counts)

Projects

GET /api/projects

POST /api/projects

Tasks

GET /api/tasks

POST /api/tasks

Users

GET /api/users

🔒 All routes require JWT token except login.

🧪 Sample CURL (Authenticated)
curl http://localhost:5000/api/projects \
-H "Authorization: Bearer <TOKEN>"
🧠 Key Learnings
Multi-tenant database design

JWT-based authentication

Secure backend APIs

Dockerized full-stack setup

Foreign key enforcement

Role-based access control

Frontend–backend integration

📌 Submission Status
✔ Backend APIs complete
✔ Frontend pages (Login, Dashboard, Projects, Tasks, Users)
✔ Docker setup working
✔ Database seeded
✔ Multi-tenant isolation achieved

👤 Author
Name: K.Tanoo sree
Project: Multi-Tenant SaaS
Role: Full Stack Developer