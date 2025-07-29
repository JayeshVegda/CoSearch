# CoSearch API Services

This directory contains all the API service functions for communicating with the CoSearch backend API.

## 📁 File Structure

```
src/services/api/
├── index.js              # Main exports and constants
├── userService.js        # User management APIs
├── searchService.js      # Search functionality APIs
├── categoryService.js    # Category management APIs
├── settingsService.js    # Settings & configuration APIs
├── apiTest.js           # API testing utilities
└── README.md            # This documentation
```

## 🚀 Quick Start

```javascript
import { 
  registerUser, 
  searchByCategory, 
  getCategoryList,
  addCategory,
  addUrl 
} from '../services/api';

// Register a user
const user = await registerUser('my-user-id');

// Get categories
const categories = await getCategoryList('my-user-id');

// Search in a category
const searchResults = await searchByCategory('my-user-id', 'Search');

// Add a new category
const newCategory = await addCategory('my-user-id', 'My Category', 'Description');

// Add a URL to a category
const newUrl = await addUrl('my-user-id', 'My Category', 'Google', 'https://google.com');
```

## 📋 API Services Overview

### User Management APIs
- `registerUser(userId)` - Register new user or get existing user
- `getUserProfile(userId)` - Get user profile and statistics
- `ensureUserExists(userId)` - Convenience function to register and get user data

### Search APIs
- `searchByCategory(userId, categoryName)` - Search sites in a specific category
- `filterSiteUrls(data)` - Filter enabled sites from search results
- `filterAllSites(data)` - Filter all sites from search results

### Category APIs
- `getCategoryList(userId)` - Get user's categories

### Settings & Configuration APIs
- `getUserData(userId)` - Get complete user data and settings
- `getUserCategories(userId)` - Get user categories for settings management
- `addCategory(userId, categoryName, description)` - Add a new category
- `editCategory(userId, catName, newCategoryName, newDescription)` - Edit category
- `deleteCategory(userId, catName)` - Delete entire category and all its URLs
- `getUrlsInCategory(userId, catName)` - Get all URLs for a specific category
- `addUrl(userId, catName, siteName, url, icon, description)` - Add a new URL to a category
- `editUrl(userId, catName, siteName, newSiteName, newUrl, newIcon, newDescription)` - Edit URL properties
- `deleteUrl(userId, catName, siteName)` - Delete specific URL from category
- `toggleUrl(userId, catName, siteName)` - Toggle URL enabled/disabled status
- `getCategoriesForSearch(userId)` - Get categories for main search functionality
- `uploadIcon(iconFile)` - Upload icon image to Cloudinary

## 🔧 Configuration

### Base URL
The API base URL is configured in `src/lib/axios.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8484/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Environment Variables
Set these in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8484/api
```

## 📊 Error Handling

All API functions include comprehensive error handling:

```javascript
try {
  const result = await registerUser('user123');
  console.log('Success:', result);
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error appropriately
}
```

### Error Response Format
```javascript
{
  status: 400,
  message: 'Bad Request',
  errors: ['Missing required field'],
  originalError: Error
}
```

## 🧪 Testing

Use the built-in API testing utilities:

```javascript
import { APITestSuite, quickAPITest } from '../services/api/apiTest';

// Run comprehensive test suite
const testSuite = new APITestSuite('test-user-123');
await testSuite.runAllTests();

// Quick test
const results = await quickAPITest('quick-test-user');

// Test specific endpoint
const result = await testEndpoint('/health');
```

## 📝 API Response Formats

### User Registration Response
```javascript
{
  success: true,
  isNewUser: true,
  message: "New user created successfully",
  user: {
    userId: "user123",
    createdAt: "2025-07-28T09:30:00.000Z",
    updatedAt: "2025-07-28T09:30:00.000Z",
    categoriesCount: 8,
    totalSites: 45
  }
}
```

### Category List Response
```javascript
{
  success: true,
  categories: ["Search", "AI", "Video", "Photo", "Shopping", "Social", "News & Media", "Finance"],
  isNewUser: false,
  totalCategories: 8,
  userCreatedAt: "2025-07-28T09:30:00.000Z"
}
```

### Search Response
```javascript
{
  success: true,
  categoryData: {
    categoryName: "Search",
    description: "Search engines and tools",
    url: [
      {
        siteName: "Google",
        url: "https://google.com",
        icon: "google.png",
        description: "World's most popular search engine",
        isChecked: true
      }
    ]
  },
  totalSites: 1,
  enabledSites: 1
}
```

## 🔄 Data Flow

1. **User Registration**: `registerUser()` → Creates/gets user with default categories
2. **Category Management**: `getCategoryList()` → Display categories in UI
3. **Search**: `searchByCategory()` → Get sites for selected category
4. **Settings**: Use settings APIs to manage categories and URLs
5. **URL Management**: Add, edit, delete, and toggle URLs within categories

## 🛡️ Security Features

- Rate limiting protection
- CORS configuration
- Input validation
- Error handling without information leakage
- Secure file uploads

## 📈 Performance Features

- Request/response logging (development only)
- Request timeout handling
- Efficient error handling
- Response compression support

## 🔗 Related Documentation

- [Backend API Documentation](../../../backend/API_DOCUMENTATION.md)
- [Axios Configuration](../../lib/axios.js)
- [API Testing Utilities](./apiTest.js)

## 🐛 Troubleshooting

### Common Issues

1. **Network Error**: Check if backend server is running
2. **CORS Error**: Verify CORS configuration in backend
3. **Timeout Error**: Increase timeout in axios configuration
4. **Validation Error**: Check request body format

### Debug Mode

Enable debug logging by setting `import.meta.env.DEV = true`:

```javascript
// This will log all API requests and responses
console.log('API Debug Mode:', import.meta.env.DEV);
```

### Testing API Connection

```javascript
import { testEndpoint } from '../services/api/apiTest';

// Test health endpoint
const healthCheck = await testEndpoint('/health');
console.log('Health Check:', healthCheck);
``` 