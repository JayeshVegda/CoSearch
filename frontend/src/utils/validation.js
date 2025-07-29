// Input validation and sanitization utilities

// URL validation
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Search query validation
export const isValidSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  
  // Remove extra whitespace
  const trimmed = query.trim();
  
  // Check minimum length
  if (trimmed.length < 1) return false;
  
  // Check maximum length
  if (trimmed.length > 500) return false;
  
  // Check for potentially dangerous characters
  const dangerousChars = /[<>\"'&]/;
  if (dangerousChars.test(trimmed)) return false;
  
  return true;
};

// Category name validation
export const isValidCategoryName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  const trimmed = name.trim();
  
  // Check length
  if (trimmed.length < 1 || trimmed.length > 50) return false;
  
  // Check for allowed characters (letters, numbers, spaces, hyphens, underscores)
  const allowedChars = /^[a-zA-Z0-9\s\-_]+$/;
  if (!allowedChars.test(trimmed)) return false;
  
  return true;
};

// Site name validation
export const isValidSiteName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  const trimmed = name.trim();
  
  // Check length
  if (trimmed.length < 1 || trimmed.length > 100) return false;
  
  // Check for potentially dangerous characters
  const dangerousChars = /[<>\"'&]/;
  if (dangerousChars.test(trimmed)) return false;
  
  return true;
};

// User ID validation
export const isValidUserId = (userId) => {
  if (!userId || typeof userId !== 'string') return false;
  
  // Check length
  if (userId.length < 10 || userId.length > 50) return false;
  
  // Check for allowed characters
  const allowedChars = /^[a-zA-Z0-9\-_]+$/;
  if (!allowedChars.test(userId)) return false;
  
  return true;
};

// File validation
export const isValidFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    maxWidth = 2048,
    maxHeight = 2048
  } = options;

  if (!file) return { isValid: false, error: 'No file provided' };

  // Check file size
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }

  // Check image dimensions (for images)
  if (file.type.startsWith('image/')) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          resolve({ 
            isValid: false, 
            error: `Image dimensions must be less than ${maxWidth}x${maxHeight}px` 
          });
        } else {
          resolve({ isValid: true });
        }
      };
      img.onerror = () => {
        resolve({ isValid: false, error: 'Invalid image file' });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  return { isValid: true };
};

// Input sanitization
export const sanitizeInput = (input, type = 'text') => {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input.trim();

  switch (type) {
    case 'url':
      // Remove any script tags and dangerous protocols
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      sanitized = sanitized.replace(/javascript:/gi, '');
      sanitized = sanitized.replace(/data:/gi, '');
      break;
      
    case 'html':
      // Remove all HTML tags
      sanitized = sanitized.replace(/<[^>]*>/g, '');
      break;
      
    case 'sql':
      // Basic SQL injection prevention
      const sqlKeywords = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi;
      sanitized = sanitized.replace(sqlKeywords, '');
      break;
      
    case 'xss':
      // XSS prevention
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
      break;
      
    default:
      // Default text sanitization
      sanitized = sanitized.replace(/[<>\"'&]/g, '');
  }

  return sanitized;
};

// Rate limiting helper
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  getRemainingRequests(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  reset(key) {
    this.requests.delete(key);
  }
}

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];

    // Required validation
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = fieldRules.required === true ? 'This field is required' : fieldRules.required;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') return;

    // Length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `Minimum length is ${fieldRules.minLength} characters`;
      return;
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `Maximum length is ${fieldRules.maxLength} characters`;
      return;
    }

    // Pattern validation
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.patternMessage || 'Invalid format';
      return;
    }

    // Custom validation
    if (fieldRules.validate) {
      const customError = fieldRules.validate(value, values);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });

  return errors;
};

// Common validation rules
export const validationRules = {
  searchQuery: {
    required: 'Please enter a search query',
    minLength: 1,
    maxLength: 500,
    validate: (value) => {
      if (!isValidSearchQuery(value)) {
        return 'Invalid search query';
      }
      return null;
    }
  },
  
  categoryName: {
    required: 'Category name is required',
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
    patternMessage: 'Only letters, numbers, spaces, hyphens, and underscores are allowed'
  },
  
  categoryDescription: {
    required: false,
    maxLength: 200
  },
  
  siteName: {
    required: 'Site name is required',
    minLength: 1,
    maxLength: 100
  },
  
  url: {
    required: 'URL is required',
    validate: (value) => {
      if (!isValidUrl(value)) {
        return 'Please enter a valid URL';
      }
      return null;
    }
  }
}; 