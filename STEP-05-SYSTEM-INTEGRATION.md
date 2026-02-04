# STEP 05: System Integration

## 📋 Overview

This document outlines the complete integration between frontend and backend, including API connection, CORS configuration, environment variables, error handling, and real-time features.

## 🔌 Frontend-Backend Connection

### 1. API Base Configuration

#### Frontend: `src/services/api.js`

**Axios Instance Setup:**
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor:**
- Attach access token to all requests
- Handle token refresh on 401 errors

**Response Interceptor:**
- Handle token refresh
- Global error handling
- Redirect to login on authentication errors

---

### 2. CORS Configuration

#### Backend: `server.js` or `middleware/cors.js`

**CORS Setup:**
```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

**Configuration:**
- Allow frontend origin only
- Enable credentials (cookies if used)
- Specify allowed methods
- Specify allowed headers

---

### 3. Environment Variables

#### Frontend: `.env`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=My Pet Care+
VITE_APP_VERSION=1.0.0

# Feature Flags (optional)
VITE_ENABLE_CHAT=true
VITE_ENABLE_NOTIFICATIONS=true
```

#### Backend: `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mypetcare_db

# JWT
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@mypetcare.com

# OTP
OTP_EXPIRY_MINUTES=10

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Security Notes:**
- Never commit `.env` files to version control
- Use `.gitignore` to exclude `.env`
- Use different secrets for development and production
- Rotate secrets periodically

---

### 4. API Service Layer

#### Frontend Service Structure

Each feature has a dedicated service file:

**Example: `src/services/petService.js`**
```javascript
import api from './api';

export const petService = {
  // Get all pets with filters
  getAllPets: (filters) => {
    return api.get('/pets', { params: filters });
  },

  // Get pet by ID
  getPetById: (id) => {
    return api.get(`/pets/${id}`);
  },

  // Add new pet (admin only)
  createPet: (data) => {
    return api.post('/pets', data);
  },

  // Update pet (admin only)
  updatePet: (id, data) => {
    return api.put(`/pets/${id}`, data);
  },

  // Delete pet (admin only)
  deletePet: (id) => {
    return api.delete(`/pets/${id}`);
  },
};
```

**Service Files:**
- `authService.js` - Authentication APIs
- `petService.js` - Pet management APIs
- `productService.js` - Product management APIs
- `orderService.js` - Order APIs
- `appointmentService.js` - Appointment APIs
- `chatService.js` - Chat APIs
- `notificationService.js` - Notification APIs
- `feedbackService.js` - Feedback APIs
- `offerService.js` - Offer APIs
- `reminderService.js` - Reminder APIs
- `customerService.js` - Customer profile APIs
- `doctorService.js` - Doctor APIs
- `adminService.js` - Admin APIs

---

### 5. Error Handling

#### Backend Error Response Format

**Standard Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `422` - Unprocessable Entity (business logic errors)
- `500` - Internal Server Error

#### Frontend Error Handling

**Global Error Handler:**
```javascript
// In api.js interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
    }
    // Show user-friendly error message
    return Promise.reject(error);
  }
);
```

**Component-Level Error Handling:**
```javascript
try {
  const response = await petService.getAllPets();
  setPets(response.data.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else {
    // Show error message
    setError(error.response?.data?.message || 'An error occurred');
  }
}
```

---

### 6. Real-Time Features

#### Chat System

**Option 1: Polling (Simple)**
- Frontend polls `/api/chat/rooms/:id/messages` every 2-3 seconds
- Check for new messages since last fetch
- Update UI with new messages

**Option 2: WebSocket (Advanced)**
- Use Socket.io for real-time communication
- Backend: Socket.io server
- Frontend: Socket.io client
- Real-time message delivery

**Implementation (Polling):**
```javascript
// In Chat component
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await chatService.getMessages(roomId);
    setMessages(response.data.data);
  }, 2000);

  return () => clearInterval(interval);
}, [roomId]);
```

#### Notifications

**Polling Approach:**
- Poll `/api/notifications/unread` every 5 seconds
- Update notification count in navbar
- Show toast notifications for new items

**Implementation:**
```javascript
// In NotificationContext
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await notificationService.getUnread();
    setUnreadCount(response.data.count);
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

---

### 7. File Upload Integration

#### Image Upload Flow

**Frontend:**
```javascript
// In component
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await api.post('/pets/123/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

**Backend:**
- Use `multer` middleware for file uploads
- Validate file type and size
- Store files in `uploads/` directory
- Return file URL in response

**Backend Implementation:**
```javascript
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  },
});

router.post('/pets/:id/images', authenticateToken, requireRole('staff', 'admin'), upload.single('image'), uploadPetImage);
```

---

### 8. State Management

#### Context API Usage

**Auth Context:**
- User authentication state
- Token management
- User profile data
- Login/logout functions

**Cart Context:**
- Cart items
- Add/remove/update items
- Cart total calculation
- Persist to localStorage

**Notification Context:**
- Unread notification count
- Notification list
- Mark as read functionality

---

### 9. Data Fetching Patterns

#### React Query (Optional but Recommended)

**Benefits:**
- Automatic caching
- Background refetching
- Optimistic updates
- Error retry logic

**Example:**
```javascript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch pets
const { data, isLoading, error } = useQuery({
  queryKey: ['pets', filters],
  queryFn: () => petService.getAllPets(filters),
});

// Create pet
const mutation = useMutation({
  mutationFn: (data) => petService.createPet(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['pets']);
  },
});
```

#### Traditional Approach (useState + useEffect)

**Example:**
```javascript
const [pets, setPets] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petService.getAllPets();
      setPets(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchPets();
}, []);
```

---

### 10. API Endpoint Mapping

#### Complete API Endpoint List

**Authentication:**
- `POST /api/auth/register` → Register user
- `POST /api/auth/verify-otp` → Verify OTP
- `POST /api/auth/login` → Login
- `POST /api/auth/refresh-token` → Refresh token
- `POST /api/auth/logout` → Logout
- `POST /api/auth/forgot-password` → Request password reset
- `POST /api/auth/reset-password` → Reset password
- `GET /api/auth/me` → Get current user

**Pets:**
- `GET /api/pets` → List pets
- `GET /api/pets/:id` → Get pet details
- `POST /api/pets` → Create pet (admin)
- `PUT /api/pets/:id` → Update pet (admin)
- `DELETE /api/pets/:id` → Delete pet (admin)

**Products:**
- `GET /api/products` → List products
- `GET /api/products/:id` → Get product details
- `POST /api/products` → Create product (admin)
- `PUT /api/products/:id` → Update product (admin)
- `DELETE /api/products/:id` → Delete product (admin)

**Orders:**
- `GET /api/orders` → List orders
- `GET /api/orders/:id` → Get order details
- `POST /api/orders/create` → Create order
- `PUT /api/orders/:id/status` → Update status (admin)
- `POST /api/orders/:id/cancel` → Cancel order

**Appointments:**
- `GET /api/appointments` → List appointments
- `GET /api/appointments/:id` → Get appointment details
- `POST /api/appointments` → Book appointment
- `PUT /api/appointments/:id/accept` → Accept (doctor)
- `PUT /api/appointments/:id/reject` → Reject (doctor)
- `PUT /api/appointments/:id/complete` → Complete (doctor)

**Chat:**
- `GET /api/chat/rooms` → List chat rooms
- `GET /api/chat/rooms/:id/messages` → Get messages
- `POST /api/chat/rooms/:id/messages` → Send message

**Notifications:**
- `GET /api/notifications` → List notifications
- `GET /api/notifications/unread` → Get unread count
- `PUT /api/notifications/:id/read` → Mark as read

*(See STEP 02 for complete API list)*

---

### 11. Testing Integration

#### API Testing

**Tools:**
- Postman (manual testing)
- Jest + Supertest (automated testing)

**Test Cases:**
- Successful API calls
- Error handling
- Authentication requirements
- Role-based access
- Data validation

#### Frontend Testing

**Tools:**
- React Testing Library
- Jest

**Test Cases:**
- Component rendering
- User interactions
- API integration
- Error states
- Loading states

---

### 12. Performance Optimization

#### Backend
- Database query optimization
- Indexing on frequently queried columns
- Connection pooling
- Response caching (Redis - optional)
- Pagination for large datasets

#### Frontend
- Code splitting (React.lazy)
- Image optimization
- Lazy loading
- Debouncing search inputs
- Memoization (useMemo, useCallback)

---

### 13. Deployment Considerations

#### Environment-Specific Configuration

**Development:**
- Local database
- Development API URL
- Debug logging enabled

**Production:**
- Production database
- Production API URL
- Error logging only
- HTTPS enforced
- CORS restricted to production domain

#### Build Process

**Frontend:**
```bash
npm run build  # Creates optimized production build
```

**Backend:**
- Use PM2 or similar for process management
- Environment variables in production
- Database migrations
- SSL certificates

---

## ✅ Integration Checklist

### Configuration
- [ ] Frontend API base URL configured
- [ ] Backend CORS configured
- [ ] Environment variables set
- [ ] .env files in .gitignore

### API Integration
- [ ] All service files created
- [ ] Axios instance configured
- [ ] Request/response interceptors set up
- [ ] Error handling implemented
- [ ] Token refresh logic working

### Real-Time Features
- [ ] Chat polling implemented
- [ ] Notification polling implemented
- [ ] WebSocket (if used) configured

### File Upload
- [ ] Multer configured on backend
- [ ] File upload service on frontend
- [ ] Image validation working

### State Management
- [ ] Auth context implemented
- [ ] Cart context implemented
- [ ] Notification context implemented

### Testing
- [ ] API endpoints tested
- [ ] Frontend components tested
- [ ] Integration tests written

### Performance
- [ ] Database queries optimized
- [ ] Frontend code split
- [ ] Images optimized
- [ ] Pagination implemented

---

**Next Step:** [STEP 06: Package Installation](./STEP-06-PACKAGE-INSTALLATION.md)

