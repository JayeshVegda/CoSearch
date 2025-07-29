// User Management APIs
export {
  registerUser,
  getUserProfile,
  ensureUserExists
} from './userService';

// Search APIs
export {
  searchByCategory,
  filterSiteUrls,
  filterAllSites
} from './searchService';

// Category APIs
export {
  getCategoryList
} from './categoryService';

// Settings & Configuration APIs
export {
  getUserData,
  getUserCategories,
  addCategory,
  editCategory,
  deleteCategory,
  getUrlsInCategory,
  addUrl,
  editUrl,
  deleteUrl,
  toggleUrl,
  getCategoriesForSearch,
  uploadIcon
} from './settingsService';

// API Documentation Reference
export const API_ENDPOINTS = {
  // System & Health APIs
  ROOT: '/',
  HEALTH: '/health',
  
  // User Management APIs
  USER_REGISTER: '/user/register',
  USER_CATEGORY: '/user/category',
  USER_SEARCH: '/user/search',
  USER_PROFILE: '/user/profile/:userId',
  
  // Settings & Configuration APIs
  SETTING_USER_DATA: '/setting/users/:userId',
  SETTING_USER_CATEGORIES: '/setting/users/:userId/categories',
  SETTING_ADD_CATEGORY: '/setting/users/:userId/categories',
  SETTING_EDIT_CATEGORY: '/setting/users/:userId/categories/:catName',
  SETTING_DELETE_CATEGORY: '/setting/users/:userId/categories/:catName',
  SETTING_RESET_TO_DEFAULT: '/setting/users/:userId/reset-to-default',
  
  // URL Management APIs
  SETTING_GET_URLS: '/setting/users/:userId/categories/:catName/urls',
  SETTING_ADD_URL: '/setting/users/:userId/categories/:catName/urls',
  SETTING_EDIT_URL: '/setting/users/:userId/categories/:catName/urls/:siteName',
  SETTING_DELETE_URL: '/setting/users/:userId/categories/:catName/urls/:siteName',
  SETTING_TOGGLE_URL: '/setting/users/:userId/categories/:catName/urls/:siteName/toggle',
  
  // Utility APIs
  SETTING_CATEGORY_SEARCH: '/setting/category',
  SETTING_UPLOAD_ICON: '/setting/icons/upload'
};

// API Response Status Codes
export const API_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// API Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized access.',
  FORBIDDEN: 'Access denied.',
  CONFLICT: 'Resource already exists.',
  TIMEOUT: 'Request timeout. Please try again.'
}; 