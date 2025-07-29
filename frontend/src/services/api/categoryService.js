import axiosInstance from '../../lib/axios';

export const getCategoryList = async (userId) => {
  try {
    const response = await axiosInstance.get('/user/category', { 
      params: { userId } 
    });
    
    // Handle API response format according to documentation
    if (response.data && response.data.success) {
      const categories = response.data.categories || [];
      
      // API returns array of strings directly
      if (categories.length > 0 && typeof categories[0] === 'string') {
        return categories;
      }
      
      // If already objects, extract categoryName
      if (categories.length > 0 && typeof categories[0] === 'object') {
        return categories.map(cat => cat.categoryName || cat.name || String(cat));
      }
      
      return categories;
    }
    
    throw new Error(response.data?.error || 'Failed to get categories');
  } catch (error) {
    console.error('Category API Error:', error);
    
    // Return fallback categories if API fails
    const fallbackCategories = ['Search', 'AI', 'Video', 'Photo', 'Shopping', 'Social', 'News & Media', 'Finance'];
    return fallbackCategories;
  }
}; 