# 🔧 CoSearch Backend

Node.js API server for CoSearch - a customizable search engine.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the API**
   - Server: http://localhost:8484
   - Health check: http://localhost:8484/health

## 📁 Project Structure

```
backend/
├── controllers/     # API route handlers
├── middleware/      # Custom middleware
├── models/         # MongoDB schemas
├── router/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── init/           # Initial data setup
├── scripts/        # Utility scripts
└── server.js       # Main server file
```

## 🔧 Environment Variables

```env
# Server
PORT=8484
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cosearch

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📡 API Endpoints

### User Management
- `POST /api/user/register` - Register new user
- `GET /api/user/category` - Get user categories
- `POST /api/user/search` - Search sites in category
- `GET /api/user/profile/:userId` - Get user profile

### Settings & Configuration
- `GET /api/setting/users/:userId` - Get complete user data
- `GET /api/setting/users/:userId/categories` - Get user categories
- `POST /api/setting/users/:userId/categories` - Add new category
- `PATCH /api/setting/users/:userId/categories/:catName` - Edit category
- `DELETE /api/setting/users/:userId/categories/:catName` - Delete category

### URL Management
- `GET /api/setting/users/:userId/categories/:catName/urls` - Get URLs in category
- `POST /api/setting/users/:userId/categories/:catName/urls` - Add new URL
- `PATCH /api/setting/users/:userId/categories/:catName/urls/:siteName` - Edit URL
- `DELETE /api/setting/users/:userId/categories/:catName/urls/:siteName` - Delete URL
- `PATCH /api/setting/users/:userId/categories/:catName/urls/:siteName/toggle` - Toggle URL status

### Admin & Utilities
- `GET /api/cleanup/stats` - Get cleanup statistics
- `POST /api/cleanup/trigger` - Manually trigger cleanup
- `POST /api/setting/icons/upload` - Upload icon image

## 🗄️ Database Schema

### UserPreferences Model
```javascript
{
  userId: String,           // Unique user identifier
  engine: [{               // Array of categories
    categoryName: String,   // Category name
    description: String,    // Category description
    url: [{                // Array of sites
      siteName: String,     // Site name
      siteUrl: String,      // Site URL
      icon: {              // Icon object
        public_id: String,
        url: String
      },
      isChecked: Boolean   // Site enabled/disabled
    }]
  }],
  lastActivity: Date       // Last user activity
}
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Database Setup
```bash
# Create demo user
node scripts/createDemoUser.js

# Upload temp images
node scripts/uploadTempImages.js
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Protection**: Configurable cross-origin requests
- **Error Handling**: Secure error messages
- **Activity Tracking**: Monitors user activity

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure MongoDB Atlas
3. Set up Cloudinary for image uploads
4. Deploy to Railway, Render, or Heroku

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cosearch
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📊 Monitoring

- **Health Check**: `GET /health`
- **Logs**: Check `logs/` directory
- **Cleanup Service**: Automatic user data cleanup after 25 days of inactivity 