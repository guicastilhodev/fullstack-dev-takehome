# Quote Portal - Full Stack Application

This repository contains a complete quote management portal with Django backend, Next.js frontend, and PostgreSQL database.

## 🚀 Quick Start with Docker

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Environment Setup

Create a `.env` file in the project root:

```env
# PostgreSQL Database
POSTGRES_DB=quote_portal
POSTGRES_USER=postgres
POSTGRES_PASSWORD=pgpass

# Django Backend
SECRET_KEY=django-insecure-v#7ktx05a8uh!&cu)t1ugc$kh$d3%*1+9eyht33%j8l3ps853t
DEBUG=True
DB_HOST=postgres_database
DB_PORT=5432
DJANGO_SUPERUSER_PASSWORD=admin

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Run the Application

```bash
docker-compose up --build
```

### 3. Access the Services

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)
  - Username: `admin`
  - Password: `admin`

## Demo Materials

### Screenshots and Videos

- `screenshots/` - Application screenshots showing key features
- `demo.mp4` - Video walkthrough of the complete system
- `api-demo.json` - Postman collection for API testing
