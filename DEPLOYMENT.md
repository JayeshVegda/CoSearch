# 🚀 CoSearch Deployment Guide

This guide will help you deploy CoSearch to production.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Cloudinary account for image uploads
- Domain name (optional but recommended)
- SSL certificate (recommended for production)

## 🔧 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Server Configuration
PORT=8484
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cosearch?retryWrites=true&w=majority

# Security
JWT_SECRET=your_very_secure_jwt_secret_key_here
SESSION_SECRET=your_very_secure_session_secret_here
ADMIN_PASSWORD=your_secure_admin_password_here
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# AI Services (optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Logging
LOG_LEVEL=info
ENABLE_LOGGING=true

# File Upload
MAX_FILE_SIZE=10mb
COMPRESSION_LEVEL=6
```

### Frontend Environment Variables

Create a `.env.production` file in the `frontend` directory:

```bash
# Production Environment Configuration
VITE_API_BASE_URL=https://your-backend-domain.com/api

# App Configuration
VITE_APP_NAME=CoSearch
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=CoSearch - Customizable Search Engine

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false

# Production
VITE_DEV_MODE=false
VITE_LOG_LEVEL=error
```

## 🏗️ Build Process

### 1. Backend Build

```bash
cd backend
npm install
npm run lint:fix  # Fix linting issues
npm test          # Run tests
npm start:prod    # Start production server
```

### 2. Frontend Build

```bash
cd frontend
npm install
npm run lint:fix  # Fix linting issues
npm run build:prod
```

The built files will be in the `frontend/dist` directory.

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm install && npm run build:prod`
3. Set output directory: `frontend/dist`
4. Add environment variables in Vercel dashboard

#### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start:prod`
4. Add environment variables in the platform dashboard

### Option 2: Docker Deployment

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8484:8484"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Option 3: Traditional VPS

1. **Backend Setup**
   ```bash
   # Install Node.js and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2

   # Deploy backend
   cd backend
   npm install
   pm2 start server.js --name "cosearch-backend"
   pm2 save
   pm2 startup
   ```

2. **Frontend Setup**
   ```bash
   # Install Nginx
   sudo apt-get install nginx

   # Build frontend
   cd frontend
   npm install
   npm run build:prod

   # Configure Nginx
   sudo cp -r dist/* /var/www/html/
   sudo systemctl restart nginx
   ```

## 🔒 Security Checklist

- [ ] Use strong, unique passwords for all services
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up proper CORS configuration
- [ ] Configure rate limiting
- [ ] Use environment variables for all secrets
- [ ] Enable security headers (Helmet.js)
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] API key rotation

## 📊 Monitoring & Logging

### Backend Logging
The application uses Winston for logging. Logs are stored in:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

### Health Checks
- Backend health endpoint: `GET /health`
- Frontend health check: Check if the app loads properly

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Test Backend
        run: |
          cd backend
          npm install
          npm run lint
          npm test
      
      - name: Test Frontend
        run: |
          cd frontend
          npm install
          npm run lint
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          echo "Deploy to your preferred platform"
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` is set correctly
   - Check if frontend and backend domains match

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network connectivity
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check Node.js version (requires 18+)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Restart the application after changes

## 📞 Support

If you encounter issues during deployment:
1. Check the logs in `backend/logs/`
2. Verify all environment variables are set correctly
3. Test the application locally first
4. Create an issue in the repository

## 🔄 Updates

To update the application:
1. Pull the latest changes
2. Update dependencies: `npm update`
3. Run tests: `npm test`
4. Rebuild and redeploy
5. Monitor for any issues 