# STEP 06: Package Installation

## 📋 Overview

This document provides the complete list of npm packages required for both frontend and backend, with exact versions and installation instructions.

## 🎯 Technology Stack Summary

### Frontend
- React.js + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Zod

### Backend
- Node.js + Express.js
- MySQL
- JWT
- bcrypt
- Nodemailer

---

## 📦 Backend Packages

### Core Dependencies

```json
{
  "name": "mypetcare-backend",
  "version": "1.0.0",
  "description": "My Pet Care+ Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.7",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "zod": "^3.22.4",
    "multer": "^1.4.5-lts.1",
    "morgan": "^1.10.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### Package Descriptions

#### Production Dependencies

1. **express** (^4.18.2)
   - Web framework for Node.js
   - Used for: API routes, middleware, server setup

2. **mysql2** (^3.6.5)
   - MySQL client for Node.js
   - Used for: Database connection, queries

3. **dotenv** (^16.3.1)
   - Environment variable management
   - Used for: Loading .env files

4. **bcrypt** (^5.1.1)
   - Password hashing library
   - Used for: Password encryption

5. **jsonwebtoken** (^9.0.2)
   - JWT token generation and verification
   - Used for: Authentication tokens

6. **nodemailer** (^6.9.7)
   - Email sending library
   - Used for: OTP emails, notifications

7. **cors** (^2.8.5)
   - Cross-Origin Resource Sharing middleware
   - Used for: Allowing frontend requests

8. **helmet** (^7.1.0)
   - Security middleware
   - Used for: HTTP header security

9. **express-rate-limit** (^7.1.5)
   - Rate limiting middleware
   - Used for: Preventing brute force attacks

10. **express-validator** (^7.0.1)
    - Request validation middleware
    - Used for: Input validation (alternative to Zod)

11. **zod** (^3.22.4)
    - Schema validation library
    - Used for: Request/response validation

12. **multer** (^1.4.5-lts.1)
    - File upload middleware
    - Used for: Image uploads

13. **morgan** (^1.10.0)
    - HTTP request logger
    - Used for: Request logging

14. **compression** (^1.7.4)
    - Response compression middleware
    - Used for: Gzip compression

#### Development Dependencies

1. **nodemon** (^3.0.2)
   - Auto-restart server on file changes
   - Used for: Development workflow

2. **jest** (^29.7.0)
   - Testing framework
   - Used for: Unit and integration tests

3. **supertest** (^6.3.3)
   - HTTP assertion library
   - Used for: API endpoint testing

### Backend Installation Commands

```bash
# Navigate to backend directory
cd backend

# Initialize package.json (if not exists)
npm init -y

# Install all production dependencies
npm install express@^4.18.2 mysql2@^3.6.5 dotenv@^16.3.1 bcrypt@^5.1.1 jsonwebtoken@^9.0.2 nodemailer@^6.9.7 cors@^2.8.5 helmet@^7.1.0 express-rate-limit@^7.1.5 express-validator@^7.0.1 zod@^3.22.4 multer@^1.4.5-lts.1 morgan@^1.10.0 compression@^1.7.4

# Install development dependencies
npm install --save-dev nodemon@^3.0.2 jest@^29.7.0 supertest@^6.3.3
```

**Or install all at once:**
```bash
npm install express mysql2 dotenv bcrypt jsonwebtoken nodemailer cors helmet express-rate-limit express-validator zod multer morgan compression

npm install --save-dev nodemon jest supertest
```

---

## 📦 Frontend Packages

### Core Dependencies

```json
{
  "name": "mypetcare-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  }
}
```

### Package Descriptions

#### Production Dependencies

1. **react** (^18.2.0)
   - React library
   - Used for: UI components

2. **react-dom** (^18.2.0)
   - React DOM renderer
   - Used for: Rendering React components

3. **react-router-dom** (^6.20.1)
   - React routing library
   - Used for: Client-side routing

4. **axios** (^1.6.2)
   - HTTP client library
   - Used for: API requests

5. **react-hook-form** (^7.49.2)
   - Form management library
   - Used for: Form handling and validation

6. **zod** (^3.22.4)
   - Schema validation library
   - Used for: Form validation schemas

7. **@hookform/resolvers** (^3.3.2)
   - React Hook Form resolvers
   - Used for: Zod integration with React Hook Form

8. **react-hot-toast** (^2.4.1)
   - Toast notification library
   - Used for: Success/error notifications

9. **date-fns** (^2.30.0)
   - Date utility library
   - Used for: Date formatting and manipulation

10. **lucide-react** (^0.294.0)
    - Icon library
    - Used for: UI icons

#### Development Dependencies

1. **@types/react** (^18.2.43)
   - TypeScript types for React
   - Used for: TypeScript support (optional)

2. **@types/react-dom** (^18.2.17)
   - TypeScript types for React DOM
   - Used for: TypeScript support (optional)

3. **@vitejs/plugin-react** (^4.2.1)
   - Vite plugin for React
   - Used for: React support in Vite

4. **vite** (^5.0.8)
   - Build tool and dev server
   - Used for: Development and production builds

5. **tailwindcss** (^3.3.6)
   - Utility-first CSS framework
   - Used for: Styling

6. **autoprefixer** (^10.4.16)
   - CSS post-processor
   - Used for: Tailwind CSS compatibility

7. **postcss** (^8.4.32)
   - CSS transformer
   - Used for: Processing Tailwind CSS

8. **eslint** (^8.55.0)
   - JavaScript linter
   - Used for: Code quality

9. **eslint-plugin-react** (^7.33.2)
   - ESLint plugin for React
   - Used for: React-specific linting

10. **eslint-plugin-react-hooks** (^4.6.0)
    - ESLint plugin for React Hooks
    - Used for: React Hooks linting

11. **eslint-plugin-react-refresh** (^0.4.5)
    - ESLint plugin for React Refresh
    - Used for: React Refresh linting

### Frontend Installation Commands

```bash
# Navigate to frontend directory
cd frontend

# Create Vite React project (if starting fresh)
npm create vite@latest . -- --template react

# Install all production dependencies
npm install react@^18.2.0 react-dom@^18.2.0 react-router-dom@^6.20.1 axios@^1.6.2 react-hook-form@^7.49.2 zod@^3.22.4 @hookform/resolvers@^3.3.2 react-hot-toast@^2.4.1 date-fns@^2.30.0 lucide-react@^0.294.0

# Install all development dependencies
npm install --save-dev @types/react@^18.2.43 @types/react-dom@^18.2.17 @vitejs/plugin-react@^4.2.1 vite@^5.0.8 tailwindcss@^3.3.6 autoprefixer@^10.4.16 postcss@^8.4.32 eslint@^8.55.0 eslint-plugin-react@^7.33.2 eslint-plugin-react-hooks@^4.6.0 eslint-plugin-react-refresh@^0.4.5
```

**Or install all at once:**
```bash
npm install react react-dom react-router-dom axios react-hook-form zod @hookform/resolvers react-hot-toast date-fns lucide-react

npm install --save-dev @vitejs/plugin-react vite tailwindcss autoprefixer postcss eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

---

## 🛠️ Additional Setup

### Tailwind CSS Configuration

**Create `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

**Create `postcss.config.js`:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Update `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Vite Configuration

**Create/Update `vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 📋 Complete Installation Steps

### Step 1: Backend Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize npm
npm init -y

# Install all packages
npm install express mysql2 dotenv bcrypt jsonwebtoken nodemailer cors helmet express-rate-limit express-validator zod multer morgan compression

npm install --save-dev nodemon jest supertest

# Create .env file
touch .env

# Create folder structure
mkdir config controllers middleware models routes services utils database
```

### Step 2: Frontend Setup

```bash
# Create frontend directory
mkdir frontend
cd frontend

# Create Vite React project
npm create vite@latest . -- --template react

# Install all packages
npm install react react-dom react-router-dom axios react-hook-form zod @hookform/resolvers react-hot-toast date-fns lucide-react

npm install --save-dev @vitejs/plugin-react vite tailwindcss autoprefixer postcss eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create .env file
touch .env

# Create folder structure
mkdir -p src/components/common src/components/layout src/components/customer src/components/doctor src/components/admin src/pages/public src/pages/customer src/pages/doctor src/pages/admin src/services src/context src/utils src/hooks src/routes src/assets/images src/assets/icons
```

---

## ✅ Verification Checklist

### Backend
- [ ] All packages installed successfully
- [ ] `package.json` created with correct dependencies
- [ ] `.env` file created
- [ ] Folder structure created
- [ ] `node_modules` folder exists

### Frontend
- [ ] All packages installed successfully
- [ ] `package.json` created with correct dependencies
- [ ] `.env` file created
- [ ] Tailwind CSS configured
- [ ] Vite configured
- [ ] Folder structure created
- [ ] `node_modules` folder exists

### Testing Installation
```bash
# Backend
cd backend
node -e "console.log('Node.js version:', process.version)"
npm list express mysql2

# Frontend
cd frontend
npm run dev  # Should start dev server on port 5173
```

---

## 🔧 Optional Packages

### Backend (Optional)
- **winston** - Advanced logging
- **redis** - Caching (if using Redis)
- **socket.io** - WebSocket support (for real-time chat)
- **swagger-ui-express** - API documentation

### Frontend (Optional)
- **@tanstack/react-query** - Data fetching and caching
- **react-query-devtools** - React Query devtools
- **framer-motion** - Animations
- **recharts** - Charts (for admin dashboard)
- **react-datepicker** - Date picker component
- **react-select** - Select dropdown component

---

## 📝 Notes

1. **Version Pinning:** All versions are pinned with `^` to allow minor updates. For production, consider using exact versions.

2. **Node.js Version:** Ensure Node.js version 18+ is installed.

3. **MySQL:** MySQL server must be installed and running separately.

4. **Environment Variables:** Copy `.env.example` to `.env` and fill in values.

5. **Git:** Add `node_modules/` and `.env` to `.gitignore`.

---

**Next Step:** [STEP 07: Final Validation](./STEP-07-FINAL-VALIDATION.md)

