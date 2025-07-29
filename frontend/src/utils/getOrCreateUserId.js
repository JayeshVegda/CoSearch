import { nanoid } from 'nanoid';

export const getOrCreateUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = nanoid();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// This function checks if a user ID already exists in the browser
// If not, it creates a new unique user ID and stores it in localStorage