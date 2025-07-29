import axiosInstance from '../../lib/axios';

/**
 * Get complete user data and settings
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Complete user data
 */
export const getUserData = async (userId) => {
  try {
    const response = await axiosInstance.get(`api/setting/users/${userId}`);
    
    if (response.data && response.data.success) {
      return response.data.user;
    }
    
    throw new Error(response.data?.error || 'Failed to get user data');
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
};

/**
 * Get user categories for settings management
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Categories array
 */
export const getUserCategories = async (userId) => {
  try {
    const response = await axiosInstance.get(`/setting/users/${userId}/categories`);
    
    if (response.data && response.data.success) {
      return response.data.categories;
    }
    
    throw new Error(response.data?.error || 'Failed to get categories');
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

/**
 * Add a new category
 * @param {string} userId - The user ID
 * @param {string} categoryName - Category name
 * @param {string} description - Category description (optional)
 * @returns {Promise<Object>} New category data
 */
export const addCategory = async (userId, categoryName, description = '') => {
  try {
    const categoryData = { categoryName };
    if (description && description.trim()) {
      categoryData.description = description;
    }
    
    const response = await axiosInstance.post(`/setting/users/${userId}/categories`, categoryData);
    
    if (response.data && response.data.success) {
      return response.data.category;
    }
    
    throw new Error(response.data?.error || 'Failed to add category');
  } catch (error) {
    console.error('Add category error:', error);
    throw error;
  }
};

/**
 * Edit category name and/or description
 * @param {string} userId - The user ID
 * @param {string} catName - Current category name
 * @param {string} newCategoryName - New category name (optional)
 * @param {string} newDescription - New description (optional)
 * @returns {Promise<Object>} Updated category data
 */
export const editCategory = async (userId, catName, newCategoryName, newDescription) => {
  try {
    const updateData = {};
    if (newCategoryName) updateData.newCategoryName = newCategoryName;
    if (newDescription && newDescription.trim()) updateData.newDescription = newDescription;
    
    const response = await axiosInstance.patch(`/setting/users/${userId}/categories/${encodeURIComponent(catName)}`, updateData);
    
    if (response.data && response.data.success) {
      return response.data.category;
    }
    
    throw new Error(response.data?.error || 'Failed to edit category');
  } catch (error) {
    console.error('Edit category error:', error);
    throw error;
  }
};

/**
 * Delete entire category and all its URLs
 * @param {string} userId - The user ID
 * @param {string} catName - Category name to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteCategory = async (userId, catName) => {
  try {
    const response = await axiosInstance.delete(`/setting/users/${userId}/categories/${encodeURIComponent(catName)}`);
    
    if (response.data && response.data.success) {
      return response.data;
    }
    
    throw new Error(response.data?.error || 'Failed to delete category');
  } catch (error) {
    console.error('Delete category error:', error);
    throw error;
  }
};

/**
 * Get all URLs for a specific category
 * @param {string} userId - The user ID
 * @param {string} catName - Category name
 * @returns {Promise<Array>} URLs array
 */
export const getUrlsInCategory = async (userId, catName) => {
  try {
    const response = await axiosInstance.get(`/setting/users/${userId}/categories/${encodeURIComponent(catName)}/urls`);
    
    if (response.data && response.data.success) {
      return response.data.urls;
    }
    
    throw new Error(response.data?.error || 'Failed to get URLs');
  } catch (error) {
    console.error('Get URLs error:', error);
    throw error;
  }
};

/**
 * Add a new URL to a category
 * @param {string} userId - The user ID
 * @param {string} catName - Category name
 * @param {string} siteName - Site name
 * @param {string} url - Site URL
 * @param {string} icon - Icon URL (optional)
 * @param {string} description - Description (optional)
 * @returns {Promise<Object>} New URL data
 */
export const addUrl = async (userId, catName, siteName, url, icon = null, description = null) => {
  try {
    const urlData = { siteName, url };
    if (icon) urlData.icon = icon;
    if (description) urlData.description = description;
    
    const response = await axiosInstance.post(`/setting/users/${userId}/categories/${encodeURIComponent(catName)}/urls`, urlData);
    
    if (response.data && response.data.success) {
      return response.data.url;
    }
    
    throw new Error(response.data?.error || 'Failed to add URL');
  } catch (error) {
    console.error('Add URL error:', error);
    throw error;
  }
};

/**
 * Edit URL properties
 * @param {string} userId - The user ID
 * @param {string} catName - Category name
 * @param {string} siteName - Current site name
 * @param {string} newSiteName - New site name (optional)
 * @param {string} newUrl - New URL (optional)
 * @param {string} newIcon - New icon (optional)
 * @param {string} newDescription - New description (optional)
 * @returns {Promise<Object>} Updated URL data
 */
export const editUrl = async (userId, catName, siteName, newSiteName, newUrl, newIcon, newDescription) => {
  try {
    const updateData = {};
    if (newSiteName) updateData.newSiteName = newSiteName;
    if (newUrl) updateData.newUrl = newUrl;
    if (newIcon) updateData.newIcon = newIcon;
    if (newDescription) updateData.newDescription = newDescription;
    
    const response = await axiosInstance.patch(
      `/setting/users/${userId}/categories/${encodeURIComponent(catName)}/urls/${encodeURIComponent(siteName)}`,
      updateData
    );
    
    if (response.data && response.data.success) {
      return response.data.url;
    }
    
    throw new Error(response.data?.error || 'Failed to edit URL');
  } catch (error) {
    console.error('Edit URL error:', error);
    throw error;
  }
};

/**
 * Delete specific URL from category
 * @param {string} userId - The user ID
 * @param {string} catName - Category name
 * @param {string} siteName - Site name to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteUrl = async (userId, catName, siteName) => {
  try {
    const response = await axiosInstance.delete(
      `/setting/users/${userId}/categories/${encodeURIComponent(catName)}/urls/${encodeURIComponent(siteName)}`
    );
    
    if (response.data && response.data.success) {
      return response.data;
    }
    
    throw new Error(response.data?.error || 'Failed to delete URL');
  } catch (error) {
    console.error('Delete URL error:', error);
    throw error;
  }
};

/**
 * Toggle URL enabled/disabled status
 * @param {string} userId - The user ID
 * @param {string} catName - Category name
 * @param {string} siteName - Site name to toggle
 * @returns {Promise<Object>} Updated URL data
 */
export const toggleUrl = async (userId, catName, siteName) => {
  try {
    const response = await axiosInstance.patch(
      `/setting/users/${userId}/categories/${encodeURIComponent(catName)}/urls/${encodeURIComponent(siteName)}/toggle`
    );
    
    if (response.data && response.data.success) {
      return response.data.url;
    }
    
    throw new Error(response.data?.error || 'Failed to toggle URL');
  } catch (error) {
    console.error('Toggle URL error:', error);
    throw error;
  }
};

/**
 * Get categories for main search functionality
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Categories array
 */
export const getCategoriesForSearch = async (userId) => {
  try {
    const response = await axiosInstance.get('/setting/category', {
      params: { userId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Get categories for search error:', error);
    throw error;
  }
};

/**
 * Upload icon image to Cloudinary
 * @param {File} iconFile - Icon file to upload
 * @returns {Promise<Object>} Upload response with public_id and url
 */
export const uploadIcon = async (iconFile) => {
  try {
    const formData = new FormData();
    formData.append('icon', iconFile);
    
    const response = await axiosInstance.post('/setting/icons/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload icon error:', error);
    throw error;
  }
}; 