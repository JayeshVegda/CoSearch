// Debug utility for troubleshooting deployment issues
export const debugInfo = {
  // Environment information
  environment: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  
  // API configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://cosearch-backend.onrender.com/api',
  
  // Build information
  buildTime: new Date().toISOString(),
  userAgent: navigator.userAgent,
  
  // Route information
  currentPath: window.location.pathname,
  currentUrl: window.location.href,
  
  // Performance information
  loadTime: performance.now(),
};

// Log debug information to console
export const logDebugInfo = () => {
  console.group('🔍 CoSearch Debug Information');
  console.log('Environment:', debugInfo.environment);
  console.log('API Base URL:', debugInfo.apiBaseUrl);
  console.log('Current Path:', debugInfo.currentPath);
  console.log('Build Time:', debugInfo.buildTime);
  console.log('User Agent:', debugInfo.userAgent);
  console.groupEnd();
  
  // Also log to localStorage for persistence
  try {
    localStorage.setItem('cosearch-debug-info', JSON.stringify(debugInfo));
  } catch (error) {
    console.warn('Could not save debug info to localStorage:', error);
  }
};

// Check for common deployment issues
export const checkDeploymentIssues = () => {
  const issues = [];
  
  // Check if API base URL is set
  if (!import.meta.env.VITE_API_BASE_URL) {
    issues.push('VITE_API_BASE_URL environment variable is not set');
  }
  
  // Check if we're in production mode
  if (!import.meta.env.PROD) {
    issues.push('Not running in production mode');
  }
  
  // Check for common routing issues
  if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/docs')) {
    issues.push('Unexpected route: ' + window.location.pathname);
  }
  
  if (issues.length > 0) {
    console.group('⚠️ Potential Deployment Issues');
    issues.forEach(issue => console.warn(issue));
    console.groupEnd();
    return issues;
  }
  
  console.log('✅ No deployment issues detected');
  return [];
};

// Initialize debug logging
if (import.meta.env.DEV || window.location.search.includes('debug=true')) {
  logDebugInfo();
  checkDeploymentIssues();
} 