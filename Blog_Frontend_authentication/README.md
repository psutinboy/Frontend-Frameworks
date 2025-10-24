# Blog Management System - Frontend

A modern React-based blog management system with comprehensive authentication and role-based access control.

## Features

✅ **Authentication System**
- User registration with role selection
- Login with JWT token authentication
- Automatic token refresh mechanism
- Secure logout functionality

✅ **Role-Based Access Control**
- Three user roles: Developer (0), Admin (1), Customer (2)
- Role-based route protection
- Dynamic UI based on user permissions
- Admin panel for user management

✅ **User Management**
- User profile page
- Admin panel for managing all users
- Role-based permissions enforcement

✅ **Blog Management**
- Create, read, update, delete blogs
- View all blogs
- Individual blog detail pages

✅ **Modern UI/UX**
- Responsive design
- Smooth page transitions
- Clean and intuitive interface
- Role indicators in header

## Quick Start

### 1. Install Dependencies
```bash
cd Blog_Frontend_authentication
npm install
```

### 2. Start the Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### 3. Ensure Backend is Running
Make sure the backend server is running on `http://localhost:3001`

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.js          # Login component
│   │   └── Register.js       # Registration component
│   ├── Blog/
│   │   ├── AddBlog.js        # Create new blog
│   │   ├── BlogDetail.js     # Blog detail view
│   │   └── BlogList.js       # List all blogs
│   └── Layout/
│       ├── Header.js         # Navigation header
│       └── Footer.js         # Footer component
├── pages/
│   ├── Home.js               # Home page
│   ├── About.js              # About page
│   ├── Profile.js            # User profile page
│   ├── AdminPanel.js         # Admin user management
│   ├── Unauthorized.js       # 403 error page
│   └── PageNotFound.js       # 404 error page
├── utils/
│   └── roleCheck.js          # Role checking utilities
├── authInterceptor.js        # Axios interceptor for auth
├── App.js                    # Main app with routing
├── App.css                   # Global styles
└── index.js                  # Entry point
```

## User Roles

| Role | Value | Access Level |
|------|-------|--------------|
| Admin | 1 | User management access and full CRUD operations |
| Customer | 2 | Basic access to blogs and tasks |
| Worker | 3 | Basic access to blogs and tasks |

## Available Routes

### Public Routes (No Authentication Required)
- `/login` - User login
- `/register` - User registration
- `/unauthorized` - Access denied page

### Protected Routes (Authentication Required)
- `/` - Home page
- `/about` - About page
- `/profile` - User profile
- `/blogs` - List all blogs
- `/blogs/:id` - View specific blog
- `/add-blog` - Create new blog

### Role-Based Routes
- `/admin` - Admin panel (Admins only)

## Authentication Flow

### Registration
1. Navigate to `/register`
2. Fill in: Email, Password, First Name, Mobile, Role
3. Submit form
4. Redirected to login page

### Login
1. Navigate to `/login`
2. Enter email and password
3. Receive JWT access token (1 day) and refresh token (7 days)
4. Tokens stored in localStorage
5. Redirected to home page

### Using the App
- All API requests automatically include the JWT token
- Token automatically refreshes when expired
- Role-based features shown/hidden based on user role

### Logout
- Click "Logout" button in header
- Tokens cleared from localStorage
- Redirected to login page

## API Integration

All API calls use the auth interceptor which automatically:
- Adds JWT token to request headers
- Handles token expiration and refresh
- Retries failed requests after token refresh

Example usage:
```javascript
import api from "../authInterceptor";

// GET request
const fetchBlogs = async () => {
  const response = await api.get('/blog');
  console.log(response.data);
};

// POST request
const createBlog = async (blogData) => {
  const response = await api.post('/blog', blogData);
  console.log(response.data);
};
```

## Role-Based Access Control

### Check User Role in Component
```javascript
import { hasRole } from "../utils/roleCheck";

// Show admin features only to admins
{hasRole([1]) && (
  <AdminFeatures />
)}
```

### Get User Information
```javascript
import { getUserFromToken, getRoleName } from "../utils/roleCheck";

const user = getUserFromToken();
console.log(user.userId, user.role);
console.log(getRoleName(user.role)); // "Admin", "Customer", or "Worker"
```

## Environment Requirements

- Node.js 14+
- npm or yarn
- React 18+
- Backend API running on `http://localhost:3001`

## Dependencies

Key dependencies:
- `react-router-dom` - Routing
- `axios` - HTTP client
- `jwt-decode` - JWT token decoding
- `react-transition-group` - Page transitions

## Testing Roles

### Test as Customer (Role 2)
1. Register with role = 2
2. Login
3. Verify access to: Home, About, Profile, Blogs, Add Blog
4. Verify NO access to: Admin Panel

### Test as Worker (Role 3)
1. Register with role = 3
2. Login
3. Verify access to: Home, About, Profile, Blogs, Add Blog
4. Verify NO access to: Admin Panel

### Test as Admin (Role 1)
1. Register with role = 1
2. Login
3. Verify access to: All features including Admin Panel
4. Verify can manage users in Admin Panel

## Security Notes

⚠️ **Important Security Considerations:**
- Tokens are stored in localStorage (consider HttpOnly cookies for production)
- Always use HTTPS in production
- Backend enforces all role checks (frontend checks are for UX only)
- Implement rate limiting on backend
- Use strong, random JWT secrets

## Documentation

- 📖 [Role-Based Access Control Guide](./ROLE_BASED_ACCESS_CONTROL.md)
- 📖 [Backend Setup Guide](../Blog_Backend_authentication/SETUP_GUIDE.md)

## Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on `http://localhost:3001`
- Check CORS settings in backend

### "Token expired" errors
- Auth interceptor should auto-refresh tokens
- Check that refresh token is valid
- May need to re-login if refresh token expired

### "Redirected to login on refresh"
- Check that tokens are in localStorage
- Verify token hasn't expired
- Check browser console for errors

## Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (one-way operation)
npm run eject
```

## Support

For issues or questions:
1. Check the documentation files
2. Review backend API endpoints
3. Inspect browser console for errors
4. Verify token and role in localStorage

## License

This project is part of a learning exercise for full-stack authentication and authorization.

