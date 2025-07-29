import axiosInstance from '../../lib/axios';

// Register a new user with the backend
export const registerUser = async (userId) => {
  try {
    const response = await axiosInstance.post('/user/register', { userId });
    return response.data;
  } catch (error) {
    console.error('User registration error:', error);
    throw error;
  }
};

// Get user categories
export const getUserCategories = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user/category?userId=${encodeURIComponent(userId)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user categories:', error);
    throw error;
  }
};

// Search for sites in a category
export const searchByCategory = async (userId, categoryName) => {
  try {
    const response = await axiosInstance.post('/user/search', { userId, categoryName });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}; 