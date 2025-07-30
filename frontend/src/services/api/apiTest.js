import {
  registerUser,
  getUserProfile,
  getCategoryList,
  searchByCategory,
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
  uploadIcon,
  API_ENDPOINTS,
  API_STATUS_CODES
} from './index';

/**
 * Comprehensive API Test Suite
 * Tests all endpoints to ensure they're working correctly
 */
export class APITestSuite {
  constructor(userId = 'test-user-' + Date.now()) {
    this.userId = userId;
    this.testResults = [];
    this.testCategory = 'Test Category';
    this.testSite = 'Test Site';
  }

  /**
   * Run all API tests
   */
  async runAllTests() {
    try {
      // System & Health APIs
      await this.testHealthEndpoints();
      
      // User Management APIs
      await this.testUserManagement();
      
      // Category Management APIs
      await this.testCategoryManagement();
      
      // URL Management APIs
      await this.testUrlManagement();
      
      // Utility APIs
      await this.testUtilityAPIs();
      
      // Cleanup
      await this.cleanup();
      
      this.printResults();
      
    } catch (error) {
      this.printResults();
    }
  }

  /**
   * Test System & Health APIs
   */
  async testHealthEndpoints() {
    // Test health endpoint
    try {
      const response = await fetch('/health');
      const data = await response.json();
      
      this.addTestResult('Health Check', response.ok, {
        status: response.status,
        data: data
      });
    } catch (error) {
      this.addTestResult('Health Check', false, { error: error.message });
    }
  }

  /**
   * Test User Management APIs
   */
  async testUserManagement() {
    // Test user registration
    try {
      const registration = await registerUser(this.userId);
      this.addTestResult('User Registration', true, registration);
    } catch (error) {
      this.addTestResult('User Registration', false, { error: error.message });
    }
    
    // Test get user profile
    try {
      const profile = await getUserProfile(this.userId);
      this.addTestResult('Get User Profile', true, profile);
    } catch (error) {
      this.addTestResult('Get User Profile', false, { error: error.message });
    }
    
    // Test get categories
    try {
      const categories = await getCategoryList(this.userId);
      this.addTestResult('Get Categories', true, { count: categories.length });
    } catch (error) {
      this.addTestResult('Get Categories', false, { error: error.message });
    }
  }

  /**
   * Test Category Management APIs
   */
  async testCategoryManagement() {
    // Test get user data
    try {
      const userData = await getUserData(this.userId);
      this.addTestResult('Get User Data', true, { categories: userData.engine?.length || 0 });
    } catch (error) {
      this.addTestResult('Get User Data', false, { error: error.message });
    }
    
    // Test add category
    try {
      const newCategory = await addCategory(this.userId, this.testCategory, 'Test category description');
      this.addTestResult('Add Category', true, newCategory);
    } catch (error) {
      this.addTestResult('Add Category', false, { error: error.message });
    }
    
    // Test edit category
    try {
      const editedCategory = await editCategory(this.userId, this.testCategory, 'Updated Test Category', 'Updated description');
      this.addTestResult('Edit Category', true, editedCategory);
    } catch (error) {
      this.addTestResult('Edit Category', false, { error: error.message });
    }
    
    // Test get URLs in category
    try {
      const urls = await getUrlsInCategory(this.userId, 'Updated Test Category');
      this.addTestResult('Get URLs in Category', true, { count: urls.length });
    } catch (error) {
      this.addTestResult('Get URLs in Category', false, { error: error.message });
    }
  }

  /**
   * Test URL Management APIs
   */
  async testUrlManagement() {
    // Test add URL
    try {
      const newUrl = await addUrl(
        this.userId, 
        'Updated Test Category', 
        this.testSite, 
        'https://example.com', 
        'https://example.com/icon.png', 
        'Test site description'
      );
      this.addTestResult('Add URL', true, newUrl);
    } catch (error) {
      this.addTestResult('Add URL', false, { error: error.message });
    }
    
    // Test edit URL
    try {
      const editedUrl = await editUrl(
        this.userId, 
        'Updated Test Category', 
        this.testSite, 
        'Updated Test Site', 
        'https://updated-example.com', 
        'https://updated-example.com/icon.png', 
        'Updated description'
      );
      this.addTestResult('Edit URL', true, editedUrl);
    } catch (error) {
      this.addTestResult('Edit URL', false, { error: error.message });
    }
    
    // Test toggle URL
    try {
      const toggledUrl = await toggleUrl(this.userId, 'Updated Test Category', 'Updated Test Site');
      this.addTestResult('Toggle URL', true, toggledUrl);
    } catch (error) {
      this.addTestResult('Toggle URL', false, { error: error.message });
    }
    
    // Test search by category
    try {
      const searchResult = await searchByCategory(this.userId, 'Updated Test Category');
      this.addTestResult('Search by Category', true, { 
        totalSites: searchResult.totalSites,
        enabledSites: searchResult.enabledSites 
      });
    } catch (error) {
      this.addTestResult('Search by Category', false, { error: error.message });
    }
  }

  /**
   * Test Utility APIs
   */
  async testUtilityAPIs() {
    // Test get categories for search
    try {
      const searchCategories = await getCategoriesForSearch(this.userId);
      this.addTestResult('Get Categories for Search', true, { count: searchCategories.length });
    } catch (error) {
      this.addTestResult('Get Categories for Search', false, { error: error.message });
    }
  }

  /**
   * Cleanup test data
   */
  async cleanup() {
    try {
      // Delete test URL
      await deleteUrl(this.userId, 'Updated Test Category', 'Updated Test Site');
      this.addTestResult('Delete URL (Cleanup)', true, {});
    } catch (error) {
      this.addTestResult('Delete URL (Cleanup)', false, { error: error.message });
    }
    
    try {
      // Delete test category
      await deleteCategory(this.userId, 'Updated Test Category');
      this.addTestResult('Delete Category (Cleanup)', true, {});
    } catch (error) {
      this.addTestResult('Delete Category (Cleanup)', false, { error: error.message });
    }
  }

  /**
   * Add test result
   */
  addTestResult(testName, success, data) {
    this.testResults.push({
      test: testName,
      success,
      data,
      timestamp: new Date().toISOString()
    });
    
    const status = success ? '✅' : '❌';
    }

  /**
   * Print test results summary
   */
  printResults() {
    );
    
    const passed = this.testResults.filter(r => r.success).length;
    const failed = this.testResults.filter(r => !r.success).length;
    const total = this.testResults.length;
    
    * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      this.testResults
        .filter(r => !r.success)
        .forEach(r => {
          });
    }
    
    this.testResults.forEach(r => {
      const status = r.success ? '✅' : '❌';
      if (r.data && Object.keys(r.data).length > 0) {
        }`);
      }
    });
  }

  /**
   * Get test results as JSON
   */
  getResults() {
    return {
      userId: this.userId,
      timestamp: new Date().toISOString(),
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(r => r.success).length,
        failed: this.testResults.filter(r => !r.success).length
      },
      results: this.testResults
    };
  }
}

/**
 * Quick test function for development
 */
export const quickAPITest = async (userId = 'quick-test-' + Date.now()) => {
  const testSuite = new APITestSuite(userId);
  await testSuite.runAllTests();
  return testSuite.getResults();
};

/**
 * Test specific endpoint
 */
export const testEndpoint = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(endpoint, config);
    const responseData = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: responseData
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}; 