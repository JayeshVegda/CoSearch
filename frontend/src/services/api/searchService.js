import axiosInstance from '../../lib/axios';

export const searchByCategory = async (userId, categoryName) => {
  try {
    const requestData = {
      userId,
      categoryName
    };

    const response = await axiosInstance.post('/user/search', requestData);
    
    // Handle new API response format
    if (response.data && response.data.success) {
      return response.data;
    }
    
    // Fallback for old API format
    return response.data;
  } catch (error) {
    console.error('Search API Error:', error);
    throw error;
  }
};

export const filterSiteUrls = (data) => {
  if (!data || !data.categoryData) {
    return [];
  }

  const categoryData = data.categoryData;
  
  if (!categoryData.url || !Array.isArray(categoryData.url)) {
    return [];
  }

  const siteUrls = categoryData.url
    .filter(site => {
      const isEnabled = site.isChecked !== false; // Use isChecked from backend
      const hasValidName = site.siteName;
      const hasValidUrl = site.siteUrl; // Use siteUrl from backend API
      
      return isEnabled && hasValidName && hasValidUrl;
    })
    .map(site => ({
      name: site.siteName,
      url: site.siteUrl, // Use siteUrl from backend API
      icon: site.icon || null,
      description: site.description || null,
      enabled: site.isChecked !== false // Use isChecked from backend
    }));

  return siteUrls;
};

export const filterAllSites = (data) => {
  if (!data || !data.categoryData) {
    return [];
  }

  const categoryData = data.categoryData;
  
  if (!categoryData.url || !Array.isArray(categoryData.url)) {
    return [];
  }

  const allSites = categoryData.url
    .filter(site => {
      const hasValidName = site.siteName;
      const hasValidUrl = site.siteUrl; // Use siteUrl from backend API
      
      return hasValidName && hasValidUrl;
    })
    .map(site => ({
      name: site.siteName,
      url: site.siteUrl, // Use siteUrl from backend API
      icon: site.icon || null,
      description: site.description || null,
      enabled: site.isChecked !== false // Use isChecked from backend
    }));

  return allSites;
};