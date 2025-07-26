# Quote Portal Backend

A Django REST Framework API for a quote submission and review system built as a full-stack take-home assessment.

## 🚀 Features

- **Authentication System**: Session-based authentication with user registration and login
- **Quote Management**: Complete CRUD operations for quotes with status tracking
- **File Upload**: Support for document attachments (PDF, JPG, PNG) up to 5MB
- **Role-Based Access**: Distinct permissions for sales users and administrators
- **Admin Dashboard**: Review and approve/reject quotes with detailed activity logging
- **Mock Integrations**: Simulated CRM and ERP system integrations
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Activity Logging**: Complete audit trail of all quote operations

## 🛠️ Tech Stack

- **Framework**: Django 5.2.4
- **API**: Django REST Framework 3.16.0
- **Database**: PostgreSQL (production) / SQLite (development)
- **Documentation**: drf-yasg (Swagger/OpenAPI)
- **Authentication**: Django sessions with CSRF protection

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- PostgreSQL (for production) or SQLite (for development)

## 🔧 Installation & Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd fullstack-dev-takehome/backend
```

### 2. Create Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 5. Database Setup

```bash
python manage.py migrate
```

### 6. Create Admin User (Optional)

```bash
python manage.py createsuperuser
```

### 7. Start Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)
- **ReDoc**: [http://localhost:8000/redoc/](http://localhost:8000/redoc/)
- **OpenAPI Schema**: [http://localhost:8000/swagger.json](http://localhost:8000/swagger.json)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

## 🔗 API Endpoints

### Authentication

| Method | Endpoint         | Description           | Access        |
| ------ | ---------------- | --------------------- | ------------- |
| POST   | `/api/login/`    | User login            | Public        |
| POST   | `/api/logout/`   | User logout           | Authenticated |
| POST   | `/api/register/` | User registration     | Public        |
| GET    | `/api/user/`     | Get current user info | Authenticated |

### Quotes Management

| Method | Endpoint                        | Description         | Access        |
| ------ | ------------------------------- | ------------------- | ------------- |
| GET    | `/api/quotes/`                  | List all quotes     | Authenticated |
| POST   | `/api/quotes/`                  | Create new quote    | Sales/Admin   |
| GET    | `/api/quotes/{id}/`             | Get quote details   | Owner/Admin   |
| PUT    | `/api/quotes/{id}/`             | Update quote        | Owner/Admin   |
| DELETE | `/api/quotes/{id}/`             | Delete quote        | Owner/Admin   |
| POST   | `/api/quotes/{id}/set_status/`  | Change quote status | Admin only    |
| POST   | `/api/quotes/{id}/upload_file/` | Upload document     | Owner/Admin   |

### Mock Integrations

| Method | Endpoint                   | Description         | Access |
| ------ | -------------------------- | ------------------- | ------ |
| POST   | `/api/crm/customers/`      | Create CRM customer | Admin  |
| GET    | `/api/crm/customers/list/` | List CRM customers  | Admin  |
| POST   | `/api/erp/orders/`         | Create ERP order    | Admin  |
| GET    | `/api/erp/orders/list/`    | List ERP orders     | Admin  |

### Activity Logs

| Method | Endpoint     | Description        | Access     |
| ------ | ------------ | ------------------ | ---------- |
| GET    | `/api/logs/` | List activity logs | Admin only |

## 📁 Project Structure

```
backend/
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── takehome/             # Main Django project
│   ├── __init__.py
│   ├── settings.py       # Django settings
│   ├── urls.py          # URL routing
│   ├── wsgi.py          # WSGI config
│   └── asgi.py          # ASGI config
├── quotes/               # Main application
│   ├── models.py        # Database models
│   ├── serializers.py   # DRF serializers
│   ├── views.py         # API views
│   ├── urls.py          # App URL routing
│   ├── admin.py         # Django admin config
│   ├── migrations/      # Database migrations
│   └── views/           # Organized view modules
│       ├── auth.py      # Authentication views
│       ├── quotes.py    # Quote management views
│       ├── crm.py       # CRM integration views
│       └── erp.py       # ERP integration views
└── media/               # Uploaded files storage
```

## 🗄️ Database Models

### User Model (Django's built-in)

- Standard Django User with `is_staff` for admin roles

### Quote Model

- `id`: Primary key
- `customer_name`: Customer name
- `customer_email`: Customer email
- `product_description`: Product details
- `quantity`: Quantity requested
- `status`: Quote status (Pending, Approved, Rejected)
- `submitted_by`: User who created the quote
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
- `supporting_document`: Optional file upload

### IntegrationLog Model

- `id`: Primary key
- `action`: Type of action performed
- `user`: User who performed the action
- `quote_id`: Related quote ID
- `payload`: JSON data of the action
- `timestamp`: When the action occurred

## 🔒 Authentication & Permissions

- **Session-based authentication** with CSRF protection
- **Role-based access control**:
  - **Sales Users**: Can create and manage their own quotes
  - **Admin Users**: Can manage all quotes, approve/reject, and access integrations
- **File upload permissions**: Only quote owners and admins can upload documents

## 🧪 Testing

```bash
python manage.py test
```

## 🚀 Deployment

### Environment Variables for Production

```env
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://user:password@host:port/database
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Static Files

```bash
python manage.py collectstatic
```

## 🔧 Development

### Code Style

- Follow PEP 8 guidelines
- Use meaningful variable and function names
- Document complex business logic

### Adding New Features

1. Create migrations: `python manage.py makemigrations`
2. Apply migrations: `python manage.py migrate`
3. Update API documentation in views
4. Add appropriate tests

## 📞 Support

For questions or issues, please refer to the project documentation or contact the development team.

---

**Note**: This is a take-home assessment project demonstrating full-stack development skills with Django REST Framework and React/Next.js.
