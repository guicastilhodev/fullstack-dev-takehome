# Quote Portal - Full Stack Take-Home Assessment

A complete quote submission and review system demonstrating full-stack development capabilities.

https://github.com/user-attachments/assets/84564c10-225b-4f25-a304-62cace641adb

## 🚀 Quick Start

### Backend (Django REST API)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

**Access the application:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- API Documentation: http://localhost:8000/swagger/

## 📋 Features

### Core Functionality

- ✅ Quote submission with file upload
- ✅ Role-based access control (sales vs admin)
- ✅ Quote review and approval workflow
- ✅ Status management with business rules
- ✅ Activity logging for all actions
- ✅ Mock CRM/ERP integrations

### Technical Features

- ✅ Session-based authentication
- ✅ Secure file upload validation
- ✅ RESTful API design
- ✅ OpenAPI/Swagger documentation
- ✅ Responsive frontend design
- ✅ Type-safe API integration

## 🏗️ Architecture

```
├── backend/           # Django REST Framework API
│   ├── quotes/        # Quote management app
│   ├── takehome/      # Project settings
│   └── README.md      # Backend documentation
├── frontend/          # Next.js React application
│   ├── src/           # Application source code
│   ├── openapi.json   # API client generation
│   └── README.md      # Frontend documentation
└── docs/              # Documentation and demos
```

https://github.com/user-attachments/assets/bece7766-fc88-4a8d-939f-3f2d0c7254b1

## 🔧 Tech Stack

**Backend:**

- Django 5.2.4 + Django REST Framework
- PostgreSQL (production) / SQLite (development)
- drf-yasg for OpenAPI documentation
- Session authentication

**Frontend:**

- Next.js 14 + TypeScript
- Tailwind CSS for styling
- React Hook Form for forms
- Axios for API calls

## 📖 API Documentation

The API is fully documented with OpenAPI/Swagger:

- **Interactive docs**: http://localhost:8000/swagger/
- **JSON spec**: http://localhost:8000/swagger.json

### Key Endpoints

- `POST /api/login/` - User authentication
- `GET|POST /api/quotes/` - Quote management
- `POST /api/quotes/{id}/set_status/` - Status changes (admin)
- `POST /api/quotes/{id}/upload_file/` - File uploads

## 👥 User Roles

**Sales Rep:**

- Submit new quotes
- Upload supporting documents
- View own quotes and status

**Admin/Reviewer:**

- View all quotes
- Approve/reject quotes
- Convert approved quotes to orders
- Access system logs

## 🔒 Security Features

- Session-based authentication with CSRF protection
- Role-based access control
- File upload validation (type, size)
- Input sanitization and validation
- Admin-only administrative functions

## 📊 Business Rules

**Quote Conversion:**

- Only approved quotes can be converted to orders
- Supporting document required for conversion
- Automatic ERP integration on conversion

**Status Flow:**

```
Pending Review → Approved/Rejected → Converted (if approved + document)
```
